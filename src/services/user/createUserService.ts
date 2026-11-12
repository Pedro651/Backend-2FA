import { hash } from "bcryptjs"
import prismaClient from "../../prisma/index"


interface usuarioProps{
    password: string,
    email:string,
    name:string
}

class CreateUserService{
    async execute({email, password, name}:usuarioProps){

        const userCertific = await prismaClient.user.findFirst({
            where:{
                email:email
            }
        })

        if(userCertific){
           throw new Error("Não tem o email")
        }

        const passwordHAsh = await hash(password, 8)

        const user = await prismaClient.user.create({
            data:{
                email:email,
                password:passwordHAsh,
                name:name
            },
             select:{
                id:true,
                name:true,
                email:true,
                role:true,
                createdAt:true,
            },
        })

        return user.name

    }
}

export { CreateUserService}