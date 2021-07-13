import {Flex, Stack, Heading,Text,Input,Button,useColorModeValue,Box,SimpleGrid,Progress,Center } from '@chakra-ui/react';
import React, { createRef, useState } from 'react';
import { getCsrfToken } from 'next-auth/client'
import { RASTREIO, VTEX } from './../../../util/api'
import { LoadingService } from './../../../util/loading'
import ProgressBar from "@badrap/bar-of-progress";
import config from './config.json'
import changelog from './changelog.json'

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

var resultado = {}

export default function Modulo({data}) {

  const [status, setStatus] = useState("")
  const [achou, setAchou] = useState(false)

  const [dataPedido, setDataPedido] = useState("")
  const [cliente, setCliente] = useState("")
  const [previsao, setPrevisao] = useState("")
  const [step, setStep] = useState(0)

  const Loading = new LoadingService(4,"#2f519b",200)
  const [LoadingStatus, setLoadingStatus] = useState(false)

  const VerificarStatusRastreio = (texto) => {
    if(texto.includes("(11)") || texto.includes("(64)")) return "separado"
    if(texto.includes("(82)") || texto.includes("(84)")) return "transporte"
    if(texto.includes("(74)")) return "rota"
    if(texto.includes("(01)")) return "entregue"
    return texto
  }

  const Previsao = (texto) => {
    return texto.split("Previsao de entrega:")[1]
  }

  const Zerar = () => {
    setStep(0)
    setAchou(false)
    setStatus("")
    setCliente("")
    setDataPedido("")
    setPrevisao("")
  }

  const ProgressCalc = (step) => {
    if(step==0)return 0
    if(step==1)return 10
    if(step==2)return 26
    if(step==3)return 42
    if(step==4)return 58
    if(step==5)return 74
    if(step==6)return 100
  }
  
  const Consultar = async event => {
    Zerar()
    event.preventDefault() // don't redirect the page

    
    Loading.iniciar()
    setLoadingStatus(true)
    setStatus("Buscando pedido...")
    

    const pedido = await VTEX.getPedido(event.target.pedido.value,{
      token: await getCsrfToken(),
      urlEnv: data.url
    })

    if(pedido.status==200){
      //achou a chave
      setStatus("Pedido encontrado, buscando rastreio...")
      setDataPedido(event.target.pedido.value)
      setCliente(pedido.data.shippingData.address.receiverName)

      //console.log(pedido.data.statusDescription)
      // definir em que ponto esta
      if(   pedido.data.status=="order-created" || 
            pedido.data.status=="on-order-completed" || 
            pedido.data.status=="payment-pending" ||
            pedido.data.status=="waiting-for-order-authorization"  
            ){
        setStep(1)
      }
      if(   pedido.data.status=="approve-payment" || 
            pedido.data.status=="payment-approved" || 
            pedido.data.status=="waiting-for-seller-decision" ||
            pedido.data.status=="authorize-fulfillment"  ||
            pedido.data.status=="window-to-cancel"
            ){
        setStep(2)
      }
      if(   pedido.data.status=="ready-for-handling" || 
            pedido.data.status=="start-handling" || 
            pedido.data.status=="handling" ||
            pedido.data.status=="order-accepted"
            ){
        setStep(3)
      }
      

      if(pedido.data.statusDescription=="Faturado"){

        const rastreamento = await RASTREIO.rastrear(pedido.data.packageAttachment.packages[0].invoiceKey,{
          token: await getCsrfToken(),
          urlEnv: data.url
        })
  
        if(rastreamento.status==200){
  
          // previsão
          setPrevisao(Previsao(rastreamento.data.tracking[0].descricao))

          for(var i=0;i<Object.keys(rastreamento.data.tracking).length;i++){
            var res = VerificarStatusRastreio(rastreamento.data.tracking[i].ocorrencia)
            if(res=="separado"){
              setStep(3)
            }
            if(res=="transporte"){
              setStep(4)
            }
            if(res=="rota"){
              setStep(5)
            }
            if(res=="entregue"){
              setStep(6)
            }
          }
  
          setStatus("Rastreio encontrado.")
          setAchou(true)
        }else{
          // não achou o rastreio
          setStatus("Pedido sem metedo de rastreio")
          setAchou(true)
          if(pedido.data.statusDescription=="Faturado"){
            if(pedido.data.shippingData.logisticsInfo[0].selectedSla=="Cliente Retira"){
              setAchou(false)
              setStatus("Sem rastreamento para pedidos retirados pelo cliente")
            }else {
              setAchou(false)
              setStatus("Sem rastreamento para "+pedido.data.shippingData.address.city)
            }
            
          }
  
        }
      }else {
        setAchou(true)
        if(pedido.data.statusDescription=="Cancelado" ){
          setAchou(false)
          setStatus("PEDIDO CANCELADO")
        }
      }

    }else {
      // não achou a chave
      setStatus("Pedido ainda não cadastrado em nenhum sistema de rastreio")
      setAchou(false)
    }

    setLoadingStatus(false)
    Loading.parar()
  }

  return (
    <>
      {!achou && 
      <div>
      <form onSubmit={Consultar}>
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
                Rastrear Pedido
              </Heading>
              <Text fontSize={'lg'} color={'gray.500'} paddingRight={9} paddingLeft={9}>
                Coloque o <b>número do pedido</b> abaixo
              </Text>
            </Stack>
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
            
              <Input
                id="pedido"
                maxLength="16"
                minLength="13"
                isRequired={true}
                isDisabled={LoadingStatus}
                type={'text'}
                placeholder={'XXXXXXXXXXXXX-01'}
                color={useColorModeValue('gray.800', 'gray.200')}
                bg={useColorModeValue('gray.100', 'gray.600')}
                rounded={'full'}
                border={0}
                _focus={{
                  bg: useColorModeValue('gray.200', 'gray.800'),
                  outline: 'none',
                }} />
                
              <Button 
                isLoading={LoadingStatus}
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
              <Stack direction="row" spacing={4} align="center">
              </Stack>
          </Stack>
        </Flex>
      </form>
      </div>
      }
      {achou  && 
        <div>
          <Flex justify={'center'}>
            <Stack marginTop={6}>
              <Text align="center" fontSize="2xl" as="b">Rastreio do pedido #{dataPedido}</Text>
            </Stack>
          </Flex>
          <Flex marginTop={6}
            justify={'center'}>
              <Stack >
                  <Stack id="header" align="" direction="row">
                    <Box id="nomeEpedido">
                      <Text id="codigoPedido" fontSize={'md'} color={'gray.500'} paddingRight={9} paddingLeft={9}>
                        <b>Destinatário:</b> {cliente}
                      </Text>
                    </Box>
                    {previsao!="" && 
                    <Box id="quandoChega">
                      <Text id="codigoPedido" fontSize={'md'} color={'gray.500'} paddingRight={9} paddingLeft={9}>
                          <b>Previsão de chegada: </b> {previsao}
                      </Text>
                    </Box>}
                  </Stack>
              </Stack>
          </Flex>
          <Box m="25px" boxShadow="xl" p="6" rounded="md" bg="white">
            <SimpleGrid
              columns={{ sm: 2, md: 1 }}
              textAlign="center"
              rounded="lg"
              color="gray.400"
              p="6" 
              rounded="md"
              >
                    {step==0 &&
                      <SimpleGrid columns={{ sm: 1, md: 6 }}>
                        <Box>Aguardando Pagamento</Box>
                        <Box>Pedido Faturado</Box>
                        <Box>Pedido Separado</Box>
                        <Box>Pedido em Transporte</Box>
                        <Box>Saiu para Entrega</Box>
                        <Box>Pedido Entregue</Box>
                      </SimpleGrid>
                    }
                    {step==1 &&
                      <SimpleGrid columns={{ sm: 1, md: 6 }}>
                        <Box color="green.500">Aguardando Pagamento</Box>
                        <Box>Pedido Faturado</Box>
                        <Box>Pedido Separado</Box>
                        <Box>Pedido em Transporte</Box>
                        <Box>Saiu para Entrega</Box>
                        <Box>Pedido Entregue</Box>
                      </SimpleGrid>
                    }
                    {step==2 &&
                      <SimpleGrid columns={{ sm: 1, md: 6 }}>
                        <Box color="green.500">Aguardando Pagamento</Box>
                        <Box color="green.500">Pedido Faturado</Box>
                        <Box>Pedido Separado</Box>
                        <Box>Pedido em Transporte</Box>
                        <Box>Saiu para Entrega</Box>
                        <Box>Pedido Entregue</Box>
                      </SimpleGrid>
                    }
                    {step==3 &&
                      <SimpleGrid columns={{ sm: 1, md: 6 }}>
                        <Box color="green.500">Aguardando Pagamento</Box>
                        <Box color="green.500">Pedido Faturado</Box>
                        <Box color="green.500">Pedido Separado</Box>
                        <Box>Pedido em Transporte</Box>
                        <Box>Saiu para Entrega</Box>
                        <Box>Pedido Entregue</Box>
                      </SimpleGrid>
                    }
                    {step==4 &&
                      <SimpleGrid columns={{ sm: 1, md: 6 }}>
                        <Box color="green.500">Aguardando Pagamento</Box>
                        <Box color="green.500">Pedido Faturado</Box>
                        <Box color="green.500">Pedido Separado</Box>
                        <Box color="green.500">Pedido em Transporte</Box>
                        <Box>Saiu para Entrega</Box>
                        <Box>Pedido Entregue</Box>
                      </SimpleGrid>
                    }
                    {step==5 &&
                      <SimpleGrid columns={{ sm: 1, md: 6 }}>
                        <Box color="green.500">Aguardando Pagamento</Box>
                        <Box color="green.500">Pedido Faturado</Box>
                        <Box color="green.500">Pedido Separado</Box>
                        <Box color="green.500">Pedido em Transporte</Box>
                        <Box color="green.500">Saiu para Entrega</Box>
                        <Box>Pedido Entregue</Box>
                      </SimpleGrid>
                    }
                    {step==6 &&
                      <SimpleGrid columns={{ sm: 1, md: 6 }}>
                        <Box color="green.500">Aguardando Pagamento</Box>
                        <Box color="green.500">Pedido Faturado</Box>
                        <Box color="green.500">Pedido Separado</Box>
                        <Box color="green.500">Pedido em Transporte</Box>
                        <Box color="green.500">Saiu para Entrega</Box>
                        <Box color="green.500">Pedido Entregue</Box>
                      </SimpleGrid>
                    }

                <Progress hasStripe colorScheme="green" size="lg" value={ProgressCalc(step)}/>


            </SimpleGrid>
            <Center>
              <Button
                onClick={() => Zerar()}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'blue.600'}
                href={'#'}
                _hover={{
                  bg: 'blue.400',
                }}>
                Buscar outro pedido
              </Button>
            </Center>
          </Box>
        </div>
      }
    </>
  );
}