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

  const { chaveOUnumero } = req.query

  const url = 
  "https://managersaas.tecnospeed.com.br:8081/ManagerAPIWeb/nfe/consulta"

  const dados = {
    grupos: [
      {nome: "Catral", codigo: "S02375921"},
      {nome: "LD", codigo: "S07308544"},
    ],
    empresas: [
      {nome: "POLLO", cnpj: "02375921001136"},
      {nome: "Matriz", cnpj: "02375921000164"},
      {nome: "Coimbra", cnpj: "02375921000245"},
      {nome: "Rio Verde", cnpj: "02375921000830"},
      {nome: "Aparecida", cnpj: "02375921000911"},
      {nome: "LD", cnpj: "07308544000164"},
    ]
  }

  function condicoes(grupo,cnpj){
    return "?Grupo="+grupo+"&CNPJ="+cnpj+"&Filtro=numero="+chaveOUnumero.slice(0, 19)+" OR chave="+chaveOUnumero+"&Campos=chave"
}

  async function busca(){
    for(var i=0; i<dados.grupos.length;i++){
      //console.log(dados.grupos[i])
      for(var j=0; j<dados.empresas.length;j++){
        //console.log(dados.empresas[j])
        //console.log(url+condicoes(dados.grupos[i].codigo,dados.empresas[j].cnpj))
        const resp = await fetch(url+condicoes(dados.grupos[i].codigo,dados.empresas[j].cnpj), {
          method: "GET",
          headers: {
            Authorization: 'Basic ' + Base64.encode(process.env.MANAGERSAAS_AUTH)
          }
        })
        const resultado = await resp.text()
        //console.log(resultado)
        if(!resultado.includes("Nenhum") && !resultado.includes("EXCEPTION")){
          return {
            achou: true,
            dados: {
              grupo: dados.grupos[i],
              empresa: dados.empresas[j],
              chave: resultado
            }
          }
        }
      }
    }
    return {
      achou: false,
    }
  }  

  if(session){

    const final = await busca()

    if(final.achou){

      res.status(200).json({
        status: 200,
        msg: "Nota encontrada",
        response: {
          grupo: final.dados.grupo.codigo,
          cnpj: final.dados.empresa.cnpj,
          chave: final.dados.chave,
        },
      })
      
    }else {
      res.status(404).json({
        status: 404,
        msg: "Nota não encontrada"
      })
    
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
