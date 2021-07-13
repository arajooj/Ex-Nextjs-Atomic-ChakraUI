import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    Button,
    Link,
    Badge,
    Image,
    useColorModeValue,
  } from '@chakra-ui/react';

  import { signIn } from 'next-auth/client'

  
  export function LoginCard() {
    return (
      <Center py={6}>
        <Box
          maxW={'320px'}
          w={'full'}
          boxShadow={'2xl'}
          rounded={'lg'}
          p={6}
          textAlign={'center'}>
          <Avatar
            size={'xl'}
            src={
              '/images/logo_centralizada.png'
            }
            alt={'Avatar Alt'}
            mb={4}
            pos={'relative'}
            _after={{
              content: '""',
              w: 4,
              h: 4,
              bg: 'green.300',
              border: '2px solid white',
              rounded: 'full',
              pos: 'absolute',
              bottom: 0,
              right: 3,
            }}
          />
          <Heading fontSize={'2xl'} fontFamily={'body'}>
            Sem permissão
          </Heading>
          <Text fontWeight={600} color={'gray.500'} mb={4}>
            Catral.io
          </Text>
          <Text
            textAlign={'center'}
            color={useColorModeValue('gray.700', 'gray.400')}
            px={3}>
            Parece que você esta deslogado.
            Por favor faça o login novamente.
          </Text>
  
    
  
          <Stack mt={8} direction={'row'} spacing={4}>
            
            <Button
              onClick={() => signIn('google', { callbackUrl: process.env.NEXTAUTH_URL })} 
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                bg: 'blue.500',
              }}
              _focus={{
                bg: 'blue.500',
              }}>
              Logar
            </Button>
          </Stack>
        </Box>
      </Center>
    );
  }