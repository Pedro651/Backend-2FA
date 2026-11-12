//Impede que um usuário que já estava logado continue usando o sistema depois de ser desativado.
import { Request,Response, NextFunction } from "express"
import prismaClient from "../prisma"
import { UserStatus } from "../generated/prisma/enums"



export async function StatusUser(req:Request, res:Response, next:NextFunction){

    const user_id = req.user_id

    const user  = await prismaClient.user.findUnique({
        where:{
            id: user_id  
        }
    })

    if (!user || user.status !== UserStatus.ACTIVE) {
     return res.status(401).json({
    message: "Usuário desativado",
    });
    }
    
    
    req.user_id = user_id;

    req.user = user;

    next();
}