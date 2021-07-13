import { getSession } from 'next-auth/client'
import nodemailer from "nodemailer"
import * as atob from 'atob'
import changelogApp from './../../../../../../changelog.json'
import changelogModule from './../../../../../../pages/modulos/nfe/changelog.json'
import { connectToDatabase } from "./../../../../../../lib/mongo"; 

import { Counter } from "./../../../../../../util/counter"

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  },
}


async function handler(req, res) {

  const session = await getSession({req})

  const { dados } = req.query
  const body = req.body

  if(session || body.token=="DESLOGADO"){

    const { client, db, cache } = await connectToDatabase(true);

    const log = await db.collection("Logger").insertOne(body.log)

    if(log.result.ok==1){
      Counter.add("consulta-nfe")
      res.status(200).json({
        msg: "Log Coletado",
        data: body.log
      })
    }else {
      res.status(404).json({
        msg: "Log não coletado"
      })
    }

  } else { // NÃO LOGADO
    res.status(403).json({
      status: 403,
      msg: "Sem autorização"
    })
  }
}
 
export default handler