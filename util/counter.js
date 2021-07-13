//import { connectToDatabase } from "./../lib/mongo"; 
import changelogApp from './../changelog.json'
import changelogModule from './../pages/modulos/nfe/changelog.json'
import { COUNTER } from './api'
import { getCsrfToken } from 'next-auth/client'

export const Counter = {
    add: async function(counter){
        return await COUNTER.add(counter,
        {
            token: await getCsrfToken(),
            urlEnv: process.env.NEXTAUTH_URL
        })
    }
    
}
