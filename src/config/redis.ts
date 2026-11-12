//Esse código cria uma conexão com o Redis usando a biblioteca ioredis. Ele serve para que sua aplicação consiga salvar, 
//buscar e manipular dados no Redis.

import Redis from "ioredis";
import "dotenv/config";

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});
