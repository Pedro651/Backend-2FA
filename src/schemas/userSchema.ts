
import {z} from 'zod'

export const createUserSchema = z.object({
  body: z.object({
    name: z.string({ message: "O nome precisa ser um texto" })
      .min(3, { message: "O nome precisa ter no minimo 3 letras" }),

    email: z.string({ message: "Email obrigatório" })
      .email({ message: "Precisa ser um email válido" }),

    password: z.string({ message: "A senha é obrigatória" })
      .refine(
        (password) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/.test(password),
        {
          message:
            "A senha deve ter no mínimo 6 caracteres, uma letra maiúscula, uma minúscula, um número e um símbolo",
        }
      ),
  }),
})

export const authUserSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email obrigatório" })
      .email({ message: "Precisa ser um email válido" }),

    password: z.string({ message: "A senha é obrigatória" })
      .refine(
        (password) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/.test(password),
        {
          message:
            "A senha deve ter no mínimo 6 caracteres, uma letra maiúscula, uma minúscula, um número e um símbolo",
        }
      ),
  }),
})