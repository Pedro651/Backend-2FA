import { NextFunction,Request,Response } from "express";
import { ZodError, ZodType } from "zod";


export const validateSchema =

   (schema:ZodType) =>
    async(req:Request, res:Response, next:NextFunction)=>{
        try{

            await schema.parseAsync({

                body:req.body,    //Dados que o usuário envia
                query: req.query, // Filtros da URL(query pega a lista)
                params:req.params //Dados da rota (params pega um item específico)
            })
        return next()

        }catch(error){
            if(error instanceof ZodError){
                return res.status(400).json({
                    error:"Não foi possivel reconhecer seus dados",


                    details:error.issues.map(issue=>({
                        campo:issue.path.slice(1).join("."),
                        mensagem:issue.message

                    }))
                })
            }
             return res.status(500).json({
            error:"Erro interno do servidor",
        })
            
        }
    }