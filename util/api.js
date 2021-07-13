export const NFE = {
    achar: async function(chaveCodigo,config){
        const res = await fetch(config.urlEnv+'/api/v2/modulos/nfe/achar/'+chaveCodigo, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Cookie: config.token,
            }
        })
        return await res.json()
    },

    pdf: async function(dados,config){
        const res = await fetch(config.urlEnv+'/api/v2/modulos/nfe/pdf/'+dados.grupo+'/'+dados.cnpj+'/'+dados.chave, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Cookie: config.token,
            }
        })
        return await res.json()
    },

    xml: async function(dados,config){
        const res = await fetch(config.urlEnv+'/api/v2/modulos/nfe/xml/'+dados.grupo+'/'+dados.cnpj+'/'+dados.chave, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Cookie: config.token,
            }
        })
        return await res.json()
    },

    cce: async function(dados,config){
        const res = await fetch(config.urlEnv+'/api/v2/modulos/nfe/cce/'+dados.grupo+'/'+dados.cnpj+'/'+dados.chave, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Cookie: config.token,
            }
        })
        return await res.json()
    },


}

export const RASTREIO = {
    rastrear: async function(chave,config){
        const res = await fetch(config.urlEnv+'/api/v2/modulos/rastreio/'+chave, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Cookie: config.token,
            }
        })
        return await res.json()
    }
}

export const VTEX = {
    getPedido: async function(codigo,config){
        const res = await fetch(config.urlEnv+'/api/v2/vtex/pedido/'+codigo, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Cookie: config.token,
            }
        })
        return await res.json()
    },

    getPedidoChave: async function(codigo,config){
        const res = await fetch(config.urlEnv+'/api/v2/vtex/pedido/'+codigo+'/onlyChave', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Cookie: config.token,
            }
        })
        return await res.json()
    }
}

export const EMAIL = {
    sendReport: async function(email,desc,print,appVersion,moduleVersion,config){

        const printBody = new FormData();
        printBody.append('print', print);

        const htmlBody = '<html><b>Quem reportou: </b>'+email+'<br><b>Versao do Aplicativo: </b>'+appVersion+'<br><b>Versao do Modulo: </b>'+moduleVersion+'<br><b>Descricao do problema: </b>'+desc+'<br></html>'
        
        var emBase64 = btoa(htmlBody)

        const res = await fetch(config.urlEnv+'/api/v2/sendEmail/dev@catral.com.br/Catral.io - System/dev@catral.com.br/Report de problema - /'+emBase64, {
            method: "POST",
            headers: {
              Cookie: config.token,
            },
            body: JSON.stringify({
                print: print,
                html: htmlBody
            })
        })
        return await res.json()
    }
}

export const LOGGER = {
    push: async function(log,config){
        //if deslogado
        if(config.token=="DESLOGADO"){
            const res = await fetch(config.urlEnv+'/api/v2/db/logger/push/', {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    log: log,
                    token: "DESLOGADO"
                })
            })
            return await res.json()
        }else{
            const res = await fetch(config.urlEnv+'/api/v2/db/logger/push/', {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  Cookie: config.token,
                },
                body: JSON.stringify({
                    log: log
                })
            })
            return await res.json()
        }
        
    }
}

export const COUNTER = {
    add: async function(counter,config){
        const res = await fetch(config.urlEnv+'/api/v2/db/counter/add/'+counter, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Cookie: config.token,
            }
        })
        return await res.json()
    }
}