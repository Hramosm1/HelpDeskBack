import { connect, config, ConnectionError } from "mssql/msnodesqlv8";

import dotenv from "dotenv"

dotenv.config()

const sqlConfig: config = {
  server: process.env.SERVER || '',
  database: process.env.DATABASE,
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
}

export const getPool = async () => {
  try {
    return await connect(sqlConfig)
  } catch (e) {
    const error: ConnectionError = e as ConnectionError
    console.info(sqlConfig)
    console.log('***************ERROR***************')
    console.error("Nombre del error: ", error.name)
    console.error("Codigo del error: ", error.code)
    console.error("Mensaje del error: ", error.message)
    console.log('***********************************')
  }
}