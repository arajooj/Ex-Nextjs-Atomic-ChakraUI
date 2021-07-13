import {Component} from './../components/crud'
import {Button} from '@chakra-ui/react'
  
export async function getServerSideProps(context) {

  return {
    props: { 
      data: {
        config:{
        }
      }
    },
  }
}

export default function main() {
  return <>
    <div><Component/></div>
  </> 
}