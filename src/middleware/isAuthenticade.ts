import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Payload{
    //Id do user
    sub: string
}

export function isAuthenticade(req:Request, res:Response, next:NextFunction){
    
    //Pega o token 
    const authToken = req.headers.authorization;

    //Faz a verificação dele
    if(!authToken){
        return res.status(401).json({
            error:"Token não fornecido"
           
        })
    }

    //Tirar o bears
    const [, token] = authToken.split(" ")

    try{
        // Verifica se o token é válido(verify) e pega o id do usuário (sub)
        //process.env.JWT_SECRET: pega a chave secreta do .env para validar o token.
        //O sub guarda tudo 
        const{ sub } = verify(token!,process.env.JWT_SECRET as string) as Payload

        req.user_id = sub
        
        return next()
    }catch(err){
        res.status(401).json({
            error:"Token invalido"
        })
    }
}