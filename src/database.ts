import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv"

dotenv.config()


declare global {
  var prisma: PrismaClient | undefined
}
export const prisma: PrismaClient = global.prisma || new PrismaClient()

global.prisma = prisma

// export const getPool = async () => {

//   console.info(sqlConfig)
//   console.log('***************ERROR***************')
//   console.error("Nombre del error: ", error.name)
//   console.error("Codigo del error: ", error.code)
//   console.error("Mensaje del error: ", error.message)
//   console.log('***********************************')
// }