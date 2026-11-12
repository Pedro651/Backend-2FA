import { Worker } from "bullmq";
import { sendMail } from "../config/mailer";
import { connection } from "../config/connection";
import { QUEUE_NAME, EmailJobData } from "../config/queue";

console.log(" Worker de e-mail iniciado!");
//Ele passa o QUEUE_NAME, porque o Worker precisa saber qual fila ele vai escutar.
export const emailWorker = new Worker<EmailJobData>(
  QUEUE_NAME, 
  async (job) => {
    const { to, subject, body } = job.data;
    console.log(` Processando e-mail para ${to}...`);

    await sendMail({
      to,
      subject,
      html: body,
    });

    console.log(`E-mail enviado com sucesso para ${to}`);
  },
  { connection }
);

//Quando um job falha ele chama esse evento
emailWorker.on("failed", (job, err) => {
  //Mostra qual job falhou e qual o error
  console.error(`Falha ao processar job ${job?.id}:`, err);
});