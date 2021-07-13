import { getSession } from 'next-auth/client'

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  },
}

async function handler(req, res) {

  const session = await getSession({req})
  const { dados } = await req.query

  if(session  || req.body.auth=="2421421"){
    const resp = await fetch('https://ssw.inf.br/api/trackingdanfe', {
    method: "POST",
    headers: new Headers({'content-type': 'application/json'}),
    body: JSON.stringify({
      chave_nfe: dados[0]
      })
    })
    const resultado = await resp.json()

    if(resultado.success==false){
      res.status(404).json({
        status: 404,
        message: resultado.message
      })
    }else {
      res.status(200).json({
        status: 200,
        message: 'Tudo ok',
        data: resultado.documento
      })
    }
  }
  else { // NÃO LOGADO
    res.status(403).json({
      status: 403,
      message:
        'Voce não esta logado.',
    })
  }
}

export default handler