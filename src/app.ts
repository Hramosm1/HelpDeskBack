//importaciones de express
import express, { Application, json, urlencoded } from "express";
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io'
//importacion de rutas
import estados from './routes/estados';
import categorias from "./routes/categorias";
import prioridades from "./routes/prioridades";
import subCategorias from "./routes/subCategorias";
import soporte from "./routes/personalDeSoporte";
import tickets from "./routes/tickets";
import comentarios from "./routes/comentariosTickets";
import documentos from "./routes/documentos";
import usuarios from "./routes/usuarios"
import supertest from "supertest";
class App {
  private serv: http.Server
  app: Application = express();
  io
  private static instance: App
  private constructor() {
    this.settings();
    this.midlewares();
    this.routes();
    this.serv = http.createServer(this.app)
    this.io = new Server(this.serv)
  }
  //configuraciones del servidor
  private settings(): void {
    this.app.set("port", process.env.PORT || 9411);
  }
  //midlewares a implementar
  private midlewares(): void {
    this.app.use(cors());
    this.app.use(json({ limit: '2mb' }));
    this.app.use(urlencoded({ extended: false }));
  }
  //rutas
  private routes(): void {
    this.app.use('/estados', estados)
    this.app.use('/categorias', categorias)
    this.app.use('/prioridades', prioridades)
    this.app.use('/subCategorias', subCategorias)
    this.app.use('/personalDeSoporte', soporte)
    this.app.use('/tickets', tickets)
    this.app.use('/comentarios', comentarios)
    this.app.use('/usuarios', usuarios)
    // this.app.use('/documentos', documentos)
  }
  public static get service() {
    return this.instance || (this.instance = new this())
  }
  //funcion publica que inicia el servidor
  public async listen(): Promise<void> {
    await this.serv.listen(this.app.get("port"));
    console.log("server on port: ", this.app.get("port"));
  }
}
export const app = App.service
export const request = supertest(app.app) 