import { Provider, signIn, signOut, useSession } from 'next-auth/client'
import { ChakraProvider, Button, ButtonGroup, Box, Text, Image, Center, Flex, Spacer, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react'
import ProgressBar from "@badrap/bar-of-progress";
import { LoginCard } from "../components/loginCard"
import { NavBar } from '../components/navBar'
import Router from "next/router";
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.css'
import { WarningIcon } from '@chakra-ui/icons'
import {Alert, AlertIcon, AlertTitle, AlertDescription, useDisclosure, Input, Textarea,Square,VisuallyHidden,useToast  } from "@chakra-ui/react"
import {Link} from "@chakra-ui/react"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react"
import { FooterCard } from "../components/footer"
import { EMAIL } from './../util/api'
import { getCsrfToken } from 'next-auth/client'

import '../styles/globals.css'

import * as changelog from '../changelog.json'

import { createRef } from 'react'
import { useScreenshot } from 'use-react-screenshot'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const progress = new ProgressBar({
  size: 4,
  color: "#2f519b",
  className: "bar-of-progress",
  delay: 100,
});



Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);



function MyApp({ Component, pageProps, data }) {
  const [session, loading] = useSession()
  const router = useRouter()
  const appVersion = "Catral.IO "+changelog[0].version


  //report
  const [reportMenu, setReportMenu] = useState(false)

  const ref = createRef(null)
  const [image, takeScreenshot] = useScreenshot()
  const getImage = () => takeScreenshot(ref.current)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  //report

  const [loadingReport, setLoadingReport] = useState(false)

  const EnviarReport = async event => {
    event.preventDefault()
  
    setLoadingReport(true)
    
    //console.log("entrou")
    const email = event.target.email.value
    const desc = event.target.desc.value
    const print = event.target.print.src
    const appVersion = event.target.appVersion.value
    const moduleVersion = event.target.moduleVersion.value
    
    const report = await EMAIL.sendReport(email,desc,print,appVersion,moduleVersion,{
      token: await getCsrfToken(),
      urlEnv: process.env.NEXTAUTH_URL
    })

    if(report.status=="200"){
      toast.success('Problema reportado. Obrigado.', {});
      onClose()
    }else {
      toast.error('Ocorreu um erro.', {});
      onClose()
    }

    setLoadingReport(false)
  }

  return <>
    {!session && <>
      <Head>
        <title>Catral.io - Logar</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="images/icone.svg" sizes="any" type="image/svg+xml"></link>
      </Head>
      <ChakraProvider>
        <Box margin="0" position="absolute" top="50%" left="50%" transform="translate(-50%, 50%)">
          <LoginCard />
        </Box>
      </ChakraProvider>
    </>}
    {session && <>
    <div ref={ref}>
      <Head>
        <title>Catral.io</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="images/icone.svg" sizes="any" type="image/svg+xml"></link>
      </Head>
      <ChakraProvider>
        <Provider session={pageProps.session}>
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            closeOnClick
            pauseOnHover
          />
          <NavBar />
          <FooterCard 
            appVersion={appVersion} 
            moduleVersion={pageProps.data.config.moduleVersion} 
            report={pageProps.data.config.report}>
          </FooterCard>

          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <form onSubmit={EnviarReport}>

              <DrawerHeader>Reportar um problema</DrawerHeader>

              <DrawerBody>
                  <Text marginTop="20px">Descrição do problema:</Text>
                  <Textarea isDisabled={loadingReport} id="desc" isRequired={true} resize="vertical" placeholder="Digite o que aconteceu..." />
                  <Text marginTop="20px">*OBS: Outros dados foram capturados (print da tela, horário e etc)</Text>
                  <VisuallyHidden>
                    <Input id="email" isDisabled value={session.user.email}/>
                    <Image id="print" src={image} alt="Imagem do problema" />
                    <Input id="appVersion" isDisabled value={appVersion}/>
                    <Input id="moduleVersion" isDisabled value={pageProps.data.config.moduleVersion}/>
                  </VisuallyHidden>
              </DrawerBody>

              <DrawerFooter>
                <Button isDisabled={loadingReport} variant="outline" mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button isLoading={loadingReport} isDisabled={loadingReport} type="submit" colorScheme="blue">Enviar</Button>
              </DrawerFooter>
              </form>
              {loadingReport && 
              <Center>
                <Box position="absolute" bottom="40px">
                  <Spinner size="xl" />
                </Box>
              </Center>
              }
            </DrawerContent>
          </Drawer>

          <Component {...pageProps} />

          <Box pos="fixed" right="0px" bottom="0px" marginBottom="45px" marginRight="20px">
            <Link color="gray.900" ref={btnRef} onClick={(event) => { getImage(); onOpen();}}
              onMouseEnter={() => setReportMenu(true)}
              onMouseLeave={() => setReportMenu(false)}>
                {!reportMenu && (
                  <WarningIcon w={8} h={8} color="red.500" />
                )}
                {reportMenu && (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertTitle mr={2}>Reportar um problema</AlertTitle>
                    </Alert>
                )}
            </Link>
          </Box>

        </Provider>
      </ChakraProvider>
      </div>
    </>}
  </>
}

export default MyApp
