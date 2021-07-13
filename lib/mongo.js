import { MongoClient } from 'mongodb'

let uri = process.env.MONGODB_URI || "" // trick ts :(
let dbName = process.env.MONGODB_DB

let cachedClient = null
let cachedDb = null

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

export async function connectToDatabase(cache) {

  if (cachedClient && cachedDb && cache===true) {
    console.log("DB_CACHE: ON")
    return { client: cachedClient, db: cachedDb, cache: true }
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = await client.db(dbName)

  cachedClient = client
  cachedDb = db

  console.log("DB_CACHE: OFF")
  return { client, db, cache: false }
  
}