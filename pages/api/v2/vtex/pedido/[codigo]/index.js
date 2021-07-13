import { getSession } from 'next-auth/client'
import {Base64} from 'js-base64';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  },
}

async function handler(req, res) {

  const session = await getSession({req})

  const { codigo } = req.query

  const url = 
  "https://catral.vtexcommercestable.com.br/api/oms/pvt/orders/"

  const dados = {}

  function condicoes(codigo){
    return codigo
  }

  async function get(){
    const resp = await fetch(url+condicoes(codigo), {
      method: "GET",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VTEX-API-AppKey': 'vtexappkey-catral-SNBDIO',
        'X-VTEX-API-AppToken': 'IKGWNBANQIJLHZJZJMSMUCPXBDZRKRFRYJXBAWNZYQCSHIJTNDVXDCVFVJUJBIDYCSMXCIYMZTOEZWQTUFEGWHNVORFRCDXPNDQOVLRFFIYKOQFYTAPWEXCUEQJKCGJV'
      }
    })
    const resultado = await resp.json()

    //console.log(resultado.error.message)

    if(resultado.error){
      return { achou: false }
    }else {
      return {
        achou: true,
        dados: resultado
      } 
    }
  }

  if(session){

    const final = await get()

    if(final.achou){

      res.status(200).json({
        status: 200,
        msg: "Pedido encontrado",
        data: final.dados
      })
      
    }else {
      res.status(404).json({
        status: 404,
        msg: "Pedido não encontrado"
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