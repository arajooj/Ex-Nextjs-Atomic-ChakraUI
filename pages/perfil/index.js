
import { PerfilCard } from '../../components/perfilCard'
//import { connectToDatabase } from "../../util/mongodb";

const axios = require('axios').default;

export async function getServerSideProps(context) {

  const res = await fetch(process.env.NEXTAUTH_URL+'/api/v2/user', {
    method: "POST",
    headers: {
      Cookie: context.req.headers.cookie
    }
  })
  const data = await res.json()
  //console.log(data)

  if (res.status!=200) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data: {
        user: data,
        config:{
          report: true
        }
      }
    }, 
  }
}

export default function perfil({data}) {

  return <>
    <PerfilCard user={data.user}/>
  </>
}
