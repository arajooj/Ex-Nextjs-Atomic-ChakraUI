import { getSession } from 'next-auth/client'
import nodemailer from "nodemailer"
import * as atob from 'atob'

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  },
}

const emailPass = process.env.EMAIL_SENDER_PASS

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "SEU-EMAIL",
        pass: emailPass
    }
})

const mailer = ({ senderMail, name, recipientMail, subject, html, image }) => {
    const date= new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
    console.log(date)
    const from = name && senderMail ? `${name} <${senderMail}>` : `${name || senderMail}`
    const message = {
        from,
        to: `${recipientMail}`,
        subject: subject+date,
        html,
        replyTo: from,
        attachments: [
          {   // use URL as an attachment
            filename: date+'.png',
            path: image
          },
        ]
    }
    return new Promise((resolve, reject) => {
        transporter.sendMail(message, (error, info) =>
            error ? reject(error) : resolve(info)
        )
    })
}

async function handler(req, res) {

  const session = await getSession({req})

  const { dados } = req.query

  const body = req.body

  const json = JSON.parse(body)
  const image = json.print
  const html = json.html

  const senderMail=dados[0]
  const name=dados[1]
  const recipientMail=dados[2]
  const subject=dados[3]

  if(session){

    const final = await mailer({ senderMail, name, recipientMail, subject, html: html, image})

    if(Object.keys(final.accepted).length>0){
      res.status(200).json({
        status: 200,
        msg: "Email Enviado",
        data: final
      })
      
    }else {
      res.status(404).json({
        status: 404,
        msg: "Email não enviado"
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