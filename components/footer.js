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
    useDisclosure,
    Container,
    Flex,
    Spacer
  } from '@chakra-ui/react';
  import React, { useEffect, useState } from 'react'
  
import { WarningIcon } from '@chakra-ui/icons'
import {Alert, AlertIcon, AlertTitle, AlertDescription, Input, Textarea  } from "@chakra-ui/react"

  export function FooterCard(props) {

    return (
        <Flex pos="fixed" bottom="0px" left="0px" right="0px" marginBottom="0px" color="grey.400" p="10px">
            <Box >
                <Text>{props.appVersion}</Text>
            </Box>
            <Spacer />
            <Box >
                <Text>Dev by FDGE</Text>
            </Box>
            <Spacer />
            <Box >
                {props.moduleVersion && 
                    <Text>{props.moduleVersion}</Text>
                }
            </Box>
        </Flex>
    );
  }


/*
<div id="appVersion2">
        
        </div>
        <div id="watermark2">
        Dev by FDGE
        </div>
        {props.moduleVersion && 
        <div id="moduleVersion2">
            {props.moduleVersion}
        </div>
        }
*/