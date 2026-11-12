import { compare } from "bcryptjs";
import prismaClient from "../../prisma";
import { sign } from "jsonwebtoken";
import { UserStatus } from "../../generated/prisma/enums";
import { sendMail } from "../../config/mailer";

interface loginUserProps {
  email: string;
  password: string;
}

class LoginUserService {
  async execute({ email, password }: loginUserProps) {

    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Usuário ou senha inválidos");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new Error("Usuário desativado");
    }

    const passwordVerify = await compare(
      password,
      user.password
    );

    if (!passwordVerify) {
      throw new Error("Usuário ou senha inválidos");
    }

    const token = sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "30d",
      }
    );

    await sendMail({
      to: user.email,
      subject:"Novo acesso a sua conta",
      html:`
      <h2>Login realizado com sucesso</h2>

      <p>Olá, ${user.name}!</p>

      <p>Detectamos um login na sua conta.</p>

      <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>

      <p>Se foi você, nenhuma ação é necessária.</p>

      <p>Se você não reconhece esse acesso, altere sua senha imediatamente.</p>
      `
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }
}

export { LoginUserService };