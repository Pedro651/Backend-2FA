import { Request, Response } from "express";
import { LoginUserService } from "../../services/user/loginUserService";
import prismaClient from "../../prisma";
import crypto from "crypto";
import {sendMail} from '../../config/mailer'
import bcrypt from "bcrypt";
import { attempts } from "../../middleware/blockSuspiciousIP";
import { gerarCodigo } from "../../services/user/twoFactorService";
import { emailQueue } from "../../config/queue";
import { redis } from "../../config/redis";

class LoginUserController{
    async handle(req:Request, res:Response){ 

    //Login com bloqueio de IP:

    const { email, password } = req.body;
    const ip = req.ip || "unknown";
    const user = req.body
    
    //try: Se o login der certo ele apaga o IP dele
    try {
        //Executa a parte do login
        const loginUser = new LoginUserService();

        const session = await loginUser.execute({
            email,
            password
        });

        // Login bem-sucedido: limpa as tentativas desse IP 
        // Login mal sucedido: conta as tentativas desse IP(não apaga atá entrar na conta)
        attempts.delete(ip);

        return res.json(session);

    } 
    //Se o login der errado, ele conta as tentativas até chegar em um determinado limmite e bloqueia
    catch (error) {

        //Nessa parte ele pega os dados de tentativa do IP se não tivar dados de tentativas(ele não errou), recomeça do 0
        const data = attempts.get(ip) || {
            count: 0,
            blockedUntil: 0,
        };

        // Adiciona +1 tentativa errada para esse IP
        data.count++;

        // Verifica se o IP chegou ao limite de erros
        if (data.count >= 5) {
            data.blockedUntil = Date.now() + 15 * 60 * 1000; // Fica 15 minutos bloqueado
            data.count = 0;

            
            return  res.status(429).json({
            error: "Muitas tentativas. Tente novamente mais tarde."
            });
        }

        //Salva/atualiza as tentativas daquele IP no Map para que a próxima tentativa consiga continuar a contagem.
        attempts.set(ip, data);

      

        // Retorna erro para o usuário informando que o login falhou
        return res.status(401).json({
         error: error instanceof Error 
         ? error.message 
         : "Email ou senha inválidos."
        });

        
    }
    }

    async requestPasswordReset(req:Request,res:Response){
        const {email} = req.body

        try{
            const user = await prismaClient.user.findUnique({
                where:{
                    email
                }})

            if(!user){
                return res.status(404).json({ error:" Usuário não encontrado"})
            }

            //Cria um token aleatório que será usado para redefinir a senha.
            const resetToken = crypto.randomBytes(32).toString("hex");
            //Tempo de expiração
            const expiresAt = new Date(Date.now() + 1000 * 60 * 15)

            await prismaClient.resetPasswordToken.create({
                data:{
                    token:resetToken,
                    user_id:user.id,
                    expiresAt:expiresAt
                }

            });


            const PORT = process.env.PORT;

            await sendMail({
            to: user.email,
            subject: "Redefinição de senha",
            html: `
                <h2>Olá, ${user.name}</h2>
                <p>Você solicitou a redefinição de senha.</p>

                <a href="http://localhost:${PORT}/api/auth/reset-password/${resetToken}">
                Redefinir minha senha
                </a>

                <p>Esse link expira em 15 minutos.</p>
            `,
            });



        }catch(error){
            console.error("Erro em requestPasswordReset", error);
            return res.status(500).json({error: "Erro interno do servidor"})
        }

    }
    //Função pra fazer o reset da senha
    async resetPassword(req:Request,res:Response){
        const {token} = req.params;
        const {newPassword} =req.body;


        //Faz com que o token seja string e n um array de string
        if (typeof token !== "string") {
        throw new Error("Token inválido");
        }

        try{
            const resetToken = await prismaClient.resetPasswordToken.findUnique({
                where:{
                    token
                }
            })

            if(!resetToken || resetToken.expiresAt < new Date()){
                return res.status(400).json({error:"Token invalido ou expirado"})
            }


            //Ela criptografa (gera o hash) da nova senha antes de salvá-la no banco.
            const hashedPassword = await bcrypt.hash(newPassword,10)

            await prismaClient.user.update({
                where:{id:resetToken.user_id}, //Ele procura o cara que mudou a senha(where) 
                data:{password:hashedPassword} //E altera a senha dele
            })

            //Remove o token antigo ja que tem um novo
            await prismaClient.resetPasswordToken.delete({where:{id:resetToken.id}});
            return res.json ({message:"Senha redefinida com sucesso!"})

            
        }catch(error){
            return res.status(500).json({error:"Erro interno do servidor"})

        }
        
        


    }
    




   async login(req: Request, res: Response) {
  const { user_id } = req.body;

  //  Adicione esta validação:
  if (!user_id) {
    return res.status(400).json({
      error: "O campo 'user_id' é obrigatório no corpo da requisição."
    });
  }

  try {
    // 1. Busca usuário no banco
    const user = await prismaClient.user.findUnique({
      where: {
        id: user_id
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado"
      });
    }

    // 2. Gera código
    const codigo = gerarCodigo(user_id);

    // 3. Salva código no Redis (2 minutos)
    await redis.set(`2fa:${user_id}`, codigo, "EX", 120);

    // 4. Coloca envio na fila BullMQ
    await emailQueue.add("email", {
      to: user.email,
      subject: "Código de verificação",
      body: `Seu código é ${codigo}`,
    });

    return res.json({
      message: "Código enviado"
    });
  } catch (error) {
    console.error("Erro no envio de 2FA:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
    
  
}



export {LoginUserController}