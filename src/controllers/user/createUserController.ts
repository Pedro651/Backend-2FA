import { Request, Response  } from "express";
import { CreateUserService } from "../../services/user/createUserService";



class CreateUserController{
    async handle(req:Request, res:Response){
        const { name, password, email} = req.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name:name,
            email:email,
            password:password
        })

        res.json(user)


        

    }
}

export {CreateUserController}