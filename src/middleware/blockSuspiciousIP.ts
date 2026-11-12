//Aqui é um armazenamento temporário das tentativas de login de cada IP:
import { Request, Response, NextFunction } from "express";

// Cria um Map para guardar os dados de cada IP.
export const attempts = new Map<
  // A chave (string) será o IP.
  string,
  {
    //count: quantidade de tentativas erradas
    count: number;
    //blockedUntil: horário até quando o IP está bloqueado
    blockedUntil: number;
  }
>();

export function blockSuspiciousIp(
  req: Request,
  res: Response,
  next: NextFunction
) {

  // Pega o IP de quem fez a requisição.Se não conseguir pegar, usa "unknown"
  const ip = req.ip || "unknown";
  //Procura se esse IP já tem histórico de tentativas. Se tiver, pega os dados salvos.Se não tiver, cria um novo registro começando do zero
  const data = attempts.get(ip) || {
    count: 0,
    blockedUntil: 0,
  };

  //Error quando o usuário tenta 5 vezes
  if (Date.now() < data.blockedUntil) {
    return res.status(403).json({
      error: "IP bloqueado temporariamente."
    });
  }

  next();
}