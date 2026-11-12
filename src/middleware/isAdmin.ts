import { Request, Response, NextFunction } from "express"
import prismaClient from "../prisma/index";

export const isAdmin = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{

    //user_id:ID do usuário que está logado
    const user_id = req.user_id;

    //Verifica
    if(!user_id){
        res.status(401).json({
            erro:"Usuário sem permisão"
        })
    }

    //Verifica no banco se tem user
    const user = await prismaClient.user.findFirst({
        where:{
            id:user_id
        }
    })

    if(!user){
         res.status(401).json({
            erro:"Usuário sem permisão"
        })
    }

    if(user?.role !== "ADMIN"){
        res.status(401).json({
            error:"Usuário sem permissão"
        });
        return
    }

    next()



}