import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes"; // Dica: Importe as rotas do arquivo routes.ts

const app = express();

// 1. Middlewares de Segurança e CORS (Topo do pipeline)
app.use(helmet());
app.use(cors());

// 2. Parser de Body JSON
app.use(express.json());

// 3. Registro do Router
app.use(router);

// 4. Configuração de Porta e Inicialização do Servidor
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});