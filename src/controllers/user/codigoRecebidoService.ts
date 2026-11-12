import { Request, Response } from "express";
import { CodigoRecebidoService } from "../../services/user/codigoRecebidoService";

class CodigoRecebidoController{
    async handle(req:Request, res:Response){

        try{
        const {user_id,codigoInserido } = req.body;

        const codigoRecibo = new CodigoRecebidoService();

        const recibo = await codigoRecibo.execute({
            user_id:user_id,
            codigoInserido:codigoInserido
        });


        
        res.json(recibo);

        }catch(error){
            
            return res.status(400).json({
                mensagem: (error as Error).message
            });
        }
        



    }
}

export {CodigoRecebidoController}