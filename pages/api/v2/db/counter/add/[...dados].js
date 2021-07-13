import { getSession } from 'next-auth/client'
import nodemailer from "nodemailer"
import * as atob from 'atob'
import changelogApp from './../../../../../../changelog.json'
import changelogModule from './../../../../../../pages/modulos/nfe/changelog.json'
import { connectToDatabase } from "./../../../../../../lib/mongo"; 

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  },
}

async function handler(req, res) {

    const { dados } = req.query

    const { client, db, cache } = await connectToDatabase(true);

    const count = await db.collection("Counter").update(
        { counter: dados[0] },
        { $inc: { quantidade: 1 } }
    );

    if(count.result.ok==1){
        res.status(200).json({
            msg: "Contador Incrementado",
        })
    }else {
        res.status(404).json({
            msg: "Erro ao incrementar"
        })
    }

}
 
export default handler