//Criar filas: Posso criar varias filas
import { Queue } from "bullmq";
import { connection} from "./connection";

//Nome da fila
export const QUEUE_NAME ="email"

//Define o corpo da fila
export interface EmailJobData{
    to:string,
    subject:string,
    body:string,
   
}

//Cria a fila email utilizando a conexão do redis
export const emailQueue = new Queue<EmailJobData>(QUEUE_NAME,{connection})

