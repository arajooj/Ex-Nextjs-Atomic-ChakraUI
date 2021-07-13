//import { connectToDatabase } from "./../lib/mongo"; 
import changelogApp from './../changelog.json'
import changelogModule from './../pages/modulos/nfe/changelog.json'
import { LOGGER } from './api'
import { getCsrfToken } from 'next-auth/client'

export const Logger = {
    NFE: {
        consulta: async function(numero){

          const res = await fetch(process.env.NEXTAUTH_URL+'/api/v2/user', {
            method: "POST",
            headers: {
              Cookie: await getCsrfToken()
            }
          })
          const user = await res.json()

          const obj = {
            "quem": user.email,
            "onde": "nfe",
            "quando": new Date(),
            "more": {
              "tipo": "consulta-nfe",
              "numero": numero
            },
            "versions": {
              "app": changelogApp[0].version,
              "module": changelogModule[0].version
            }
          }
          return await LOGGER.push(obj,
            {
              token: await getCsrfToken(),
              urlEnv: process.env.NEXTAUTH_URL
            })
        },
    },
    SESSION: {
        login: async function(quem){

          const obj = {
            "quem": quem,
            "onde": "session",
            "quando": new Date(),
            "more": {
              "tipo": "login",
            },
            "versions": {
              "app": changelogApp[0].version,
              "module": changelogModule[0].version
            }
          }
          console.log(await LOGGER.push(obj,
            {
              token: 'DESLOGADO',
              urlEnv: process.env.NEXTAUTH_URL
            }))
          return 
        }
    }
    
}
