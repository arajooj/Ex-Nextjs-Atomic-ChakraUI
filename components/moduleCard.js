import Image from 'next/image';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router'

function getModule(modulos,modulo) {
    return modulos.filter(
        function(modulos){ 
            if(modulos.id==modulo){
                return modulos.id==modulo
            }
         }
    );
  }

export function ModuleCard(props) {

    const router = useRouter()

    const modulo = getModule(props.modulos,props.modulo)

    return (
            <Box onClick={() => router.push(modulo[0].config.endpoint)}
                maxW={'250px'}
                maxH={'250px'}
                minH={'250px'}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                rounded={'md'}
                p={6}
                overflow={'hidden'}>
                
                <Stack>
                <Text
                    color={modulo[0].config.color}
                    textTransform={'uppercase'}
                    fontWeight={800}
                    fontSize={'sm'}
                    letterSpacing={1.1}>
                    {modulo[0].categoria}
                </Text>
                <Heading
                    color={useColorModeValue('gray.700', 'white')}
                    fontSize={'2xl'}
                    fontFamily={'body'}>
                    {modulo[0].nome}
                </Heading>
                <Text color={'gray.500'}>
                {modulo[0].descricao}
                </Text>
                </Stack>
            </Box>
    );
}