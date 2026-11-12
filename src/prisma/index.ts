import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'

//Pega a URL de conexão do banco 
const connectionString = `${process.env.DATABASE_URL}`;

//Será responsavel por conectar ao banco 
const adapter = new PrismaPg({ connectionString })

//Vai acessar todas as tabelas que a gente criou do banco
const prismaClient = new PrismaClient({adapter})

//Ele vai servi pra gente manipular o banco de dados(manipular dados do banco de dados)
export default prismaClient