import { getSession } from 'next-auth/client'

import { Modules } from './../../../util/db'

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  },
}

async function handler(req, res) {

    const session = await getSession({req})

    if (session) { // LOGADO
        res.status(200).json({
            modules: await Modules.getAll()
        })
    } else { // NÃO LOGADO
        res.status(403).json({
        message:
            'Voce não esta logado.',
        })
    }
}

export default handler
