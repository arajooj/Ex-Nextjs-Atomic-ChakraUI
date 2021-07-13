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

  const { dados } = req.query
  
  const url_cce = 
  "https://managersaas.tecnospeed.com.br:8081/ManagerAPIWeb/nfe/imprime"

  function condicoes(grupo,cnpj,chave){
    return "?Grupo="+grupo+"&CNPJ="+cnpj+"&ChaveNota="+chave+"&Url=1&Documento=CCe"
  }

  if(session){

    const pdf = await fetch(url_cce+condicoes(dados[0],dados[1],dados[2]), {
        method: "GET",
        headers: {
          Authorization: 'Basic ' + Base64.encode(process.env.MANAGERSAAS_AUTH)
        }
    })
    const resultado = await pdf.text()

    if(resultado.includes("EXCEPTION")){
        res.status(404).json({
            status: 404,
            msg: "CCe não encontrada"
        })
    }else {
        if(dados[3]==="onlyXML"){
            res.status(200).send(
                resultado
            )
        }else{
            res.status(200).json({
                status: 200,
                msg: "CCe encontrada",
                response: {
                        cce: resultado,
                    }
            })
        }
    }

  } else { // NÃO LOGADO
    res.status(403).json({
      status: 403,
      msg: "Sem autorização"
    })
  }
  
  

  /*

    
    
    //console.log(pdf)

    //retorna
    
  }
 
  */
}
 
export default handler
