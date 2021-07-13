import { connectToDatabase } from "./../lib/mongo";

export const Modules = {
    get: async function(id){
        const { db } = await connectToDatabase(true);
        const res = await db
            .collection("Modules")
            .find({id: id})
            .toArray();
        return await res[0]
    },
    getAll: async function(){
        const { db } = await connectToDatabase(true);
        const res = await db
            .collection("Modules")
            .find({})
            .sort({ metacritic: -1 })
            .toArray();
        return await res
        }
}

export const Users = {
    get: async function(name){
        const { db } = await connectToDatabase(true);
        const res = await db
            .collection("Users")
            .find({nome: name})
            .toArray();
        return await res[0]
    },
    getAll: async function(){
        const { db } = await connectToDatabase(true);
        const res = await db
            .collection("Users")
            .find({})
            .limit(20)
            .sort({ metacritic: -1 })
            .toArray();
        return await res
    }
}
