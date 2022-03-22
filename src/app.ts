//importaciones de express
import express, { Application, json, urlencoded } from "express";
import cors from "cors";
//importacion de rutas
import estados from './routes/estados';
import categorias from "./routes/categorias";
import prioridades from "./routes/prioridades";
import subCategorias from "./routes/subCategorias";
export class App {
  base: string = "/node/api";
  private app: Application;
  constructor(port?: number | string) {
    this.app = express();
    this.settings();
    this.midlewares();
    this.routes();
  }
  //configuraciones del servidor
  private settings(): void {
    this.app.set("port", process.env.PORT || 3000);
  }
  //midlewares a implementar
  private midlewares(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
  }
  //rutas
  private routes(): void {
    this.app.use('/estados', estados)
    this.app.use('/categorias', categorias)
    this.app.use('/prioridades', prioridades)
    this.app.use('/subCategorias', subCategorias)
  }

  //funcion publica que inicia el servidor
  public async listen(): Promise<void> {
    await this.app.listen(this.app.get("port"));
    console.log("server on port: ", this.app.get("port"));
  }
}
