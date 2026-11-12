import { Request, Response } from "express";
import { gerarCodigo } from "./twoFactorService";
import { redis } from "../../config/redis";

interface codigoProps{
    user_id:string,
    codigoInserido:string
}
class CodigoRecebidoService{
    async execute({user_id, codigoInserido}:codigoProps){

     

        
        
          //Pego o momento de agora
          const agora = Date.now()
        
          //Pega o codigo que foi gerado agora
          const codigoEsperadoAtual = gerarCodigo(user_id,agora)
        
          // Pega o codigo que foi gerado antes de agora
          const codigoEsperadodoPassado = gerarCodigo(user_id,agora - 120000)
        
            // Se o código digitado for igual ao atual OU ao anterior, aceita!
            if (codigoInserido === codigoEsperadoAtual || codigoInserido === codigoEsperadodoPassado) {
                return true; 
                
            }
            
            // Se não bater com nenhum dos dois, recusa.
            if(codigoInserido !== codigoEsperadoAtual || codigoInserido !== codigoEsperadodoPassado){
            throw new Error("Codigo errado")
            
            }
              
            //Código correto:remove do Redis para não permitir que seja usado novamente
             await redis.del(
            `codigo:${user_id}`
            );
             
        


    }
}

export {CodigoRecebidoService}