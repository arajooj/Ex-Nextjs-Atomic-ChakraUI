import { getSession } from 'next-auth/client'

import { Users } from './../../../util/db'

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  },
}

async function handler(req, res) {

  const session = await getSession({req})

  if (session) { // LOGADO

    const getUser = await Users.get(session.user.email.split('@')[0])

    res.status(200).json({
      name: session.user.name,
      email: session.user.email,
      avatar: session.user.image,
      adicionais: {
        cargo: getUser.adicionais.cargo,
        dep: getUser.adicionais.dep,
        ramal: getUser.adicionais.ramal
      },
      modulos: getUser.modulos,
    })
  } else { // NÃO LOGADO
    res.status(403).json({
      message:
        'Voce não esta logado.',
    })
  }
}

export default handler
