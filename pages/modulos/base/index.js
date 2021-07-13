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

import config from './config.json'
import changelog from './changelog.json'

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        url: process.env.NEXTAUTH_URL,
        config: {
          moduleVersion: config.moduleName+" "+changelog[0].version
        }
      }
    }, // will be passed to the page component as props
  }
}

export default function Modulo({data}) {

  const FuncaoEXEMPLO = async event => {
    event.preventDefault() // nao redireciona
    // faca oque quiser aqui
  }

  return (
    <>
      <div>Este e um modulo Base</div>
    </>
  );
}