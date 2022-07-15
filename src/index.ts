import { app } from "./app";
app.io.on("connection", (socket) => {
  console.log('cliente conectado')
})
app.listen()