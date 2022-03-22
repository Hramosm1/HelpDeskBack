import { App } from "./app";
import { getPool } from "./database";
const app = new App()
app.listen()
async function main() {
  const pool = await getPool()
  const result = await pool?.query("SELECT GETDATE()")
  console.log(result)
}
main()