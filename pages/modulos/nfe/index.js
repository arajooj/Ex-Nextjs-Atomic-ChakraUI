import {
  Flex,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  Icon,
  useColorModeValue,
  createIcon,
  Progress,
  Link,
  Badge
} from '@chakra-ui/react';

import { useState } from 'react';

import { getSession, getCsrfToken } from 'next-auth/client'

import { NFE } from './../../../util/api'

import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import config from './config.json'
import changelog from './changelog.json'

/*LOGGER BASE
import { Logger } from './../util/logger'
onClick={()=>Logger.NFE.consulta('teste')}
*/

import { Logger } from './../../../util/logger'

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        url: process.env.NEXTAUTH_URL,
        config: {
          moduleVersion: config.moduleName+" "+changelog[0].version,
          report: true
        }
      }
    }, // will be passed to the page component as props
  }
}

export default function Modulo({data}) {

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBar, setLoadingBar] = useState(0);

  const [acharResult, setAchaResult] = useState(0)
  const [pdfResult, setPdfResult] = useState(0)
  const [xmlResult, setXmlResult] = useState(0)
  const [cceResult, setCceResult] = useState(0)

  const [achaData, setAchaData] = useState("")
  const [pdfData, setPdfData] = useState("")
  const [xmlData, setXmlData] = useState("")
  const [cceData, setCceData] = useState("")

  async function adicionarMarcaDagua(url,nome){
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    firstPage.drawText('2° VIA DE NOTA FISCAL', {
      x: 100,
      y: height / 2 + 200,
      size: 50,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(-45),
      opacity: 0.2
    })
    const pdfBytes = await pdfDoc.save()
    var bytes = new Uint8Array(pdfBytes); // pass your byte response to this constructor
    var blob=new Blob([bytes], {type: "application/pdf"});// change resultByte to bytes
    var link=document.createElement('a');
    link.href=window.URL.createObjectURL(blob);
    link.download=nome+".pdf";
    link.click();
  }


  const Consultar = async event => {
    event.preventDefault() // don't redirect the page

    setAchaResult(0)
    setPdfResult(0)
    setXmlResult(0)
    setCceResult(0)

    setLoading(true)
    setLoadingBar(20)
    setStatus("Iniciando busca de NFE...")

    Logger.NFE.consulta(event.target.chave.value)
    const achar = await NFE.achar(event.target.chave.value,{
      token: await getCsrfToken(),
      urlEnv: data.url
    })

    if(achar.status==200){
      setLoadingBar(40)
      setStatus("NFE encontrada...")
      setAchaData(achar.response.chave)
      setAchaResult(200)

      setStatus("Buscando PDF...")
      const pdf = await NFE.pdf(
        {
          grupo: achar.response.grupo,
          cnpj: achar.response.cnpj,
          chave: achar.response.chave
        },
        {
          token: await getCsrfToken(),
          urlEnv: data.url
        }
      )
      if(pdf.status==200){
        setLoadingBar(60)
        setStatus("PDF encontrado...")
        setPdfResult(200)
        setPdfData(pdf.response.url)
      }
    
    setStatus("Buscando XML...")
     const xml = await NFE.xml(
        {
          grupo: achar.response.grupo,
          cnpj: achar.response.cnpj,
          chave: achar.response.chave
        },
        {
          token: await getCsrfToken(),
          urlEnv: data.url
        }
      )
      if(xml.status==200){
        setLoadingBar(80)
        setStatus("XML encontrado...")
        setXmlResult(200)
        setXmlData('data:text/xml,' + encodeURIComponent(xml.response.xml))
      }

      setStatus("Buscando CCe...")
      const cce = await NFE.cce(
        {
          grupo: achar.response.grupo,
          cnpj: achar.response.cnpj,
          chave: achar.response.chave
        },
        {
          token: await getCsrfToken(),
          urlEnv: data.url
        }
      )
      if(cce.status==200){
        setLoadingBar(100)
        setStatus("CCe encontrada...")
        setCceResult(200)
        setCceData(cce.response.cce)
      }else{
        setStatus("CCe não encontrada...")
      }

    }else{
      setLoadingBar(100)
      setStatus("ERRO...")
      if(achar.status==403){
        setAchaResult(403)
      }
      if(achar.status==404){
        setAchaResult(404)
      }
    }

    setLoadingBar(0)
    setStatus("")
    setLoading(false)
  }

  return (
    <>
      <form onSubmit={Consultar}>
      {loading && <Progress hasStripe colorScheme="blue" size="sm" value={loadingBar} />}
        <Flex
          minH={'80vh'}
          align={'center'}
          justify={'center'}
          py={12}>
          <Stack
            boxShadow={'2xl'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            p={10}
            spacing={8}
            align={'center'}>
            <Stack align={'center'} spacing={2}>
              <Heading
                textTransform={'uppercase'}
                fontSize={'3xl'}
                color={useColorModeValue('gray.800', 'gray.200')}>
                2° Via nota Fiscal, XML e PDF
              </Heading>
              <Text fontSize={'lg'} color={'gray.500'} paddingRight={9} paddingLeft={9}>
                Coloque o <b>número da nota</b> ou a <b>chave</b> abaixo
              </Text>
            </Stack>
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
            
              <Input
                id="chave"
                maxLength="44"
                minLength="6"
                isRequired={true}
                isDisabled={loading}
                type={'text'}
                placeholder={'5221......   ou   234......'}
                color={useColorModeValue('gray.800', 'gray.200')}
                bg={useColorModeValue('gray.100', 'gray.600')}
                rounded={'full'}
                border={0}
                _focus={{
                  bg: useColorModeValue('gray.200', 'gray.800'),
                  outline: 'none',
                }} />
                
              <Button 
                isLoading={loading}
                type="submit"
                bg={'blue.400'}
                rounded={'full'}
                color={'white'}
                flex={'1 0 auto'}
                _hover={{ bg: 'blue.500' }}
                _focus={{ bg: 'blue.500' }}>
                Consultar
              </Button>
            </Stack>
            {status!="" && <div>{status}</div>}
            {acharResult==200 && <Badge colorScheme="green">Nota encontrada</Badge>}
            {acharResult==403 && <Badge colorScheme="yellow">Não autorizado - Reinicie a pagina</Badge>}
            {acharResult==404 && <Badge colorScheme="red">Nota não encontrada</Badge>}
            
              <Stack direction="row" spacing={4} align="center">
                {pdfResult==200 && 
                  <Button onClick={() => adicionarMarcaDagua(pdfData,achaData)} colorScheme="red" variant="solid">
                    Baixar NFE (PDF)
                  </Button>
                }
                {xmlResult==200 && 
                  <Link  href={xmlData} download={achaData+".xml"} isExternal>
                    <Button colorScheme="teal" variant="outline">
                      Baixar XML
                    </Button>
                  </Link>
                }
                {cceResult==200 && 
                  <Link  href={cceData} isExternal>
                    <Button colorScheme="orange" variant="solid">
                      Baixar CCe (PDF)
                    </Button>
                  </Link>
                } 
              </Stack>
          </Stack>
        </Flex>
      </form>
    </>
  );
}