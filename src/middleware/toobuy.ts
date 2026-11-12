//Verifica se o servidor está sobrecarregado e, se estiver, rejeita novas requisições temporariamente.
import { Request, Response, NextFunction } from "express";
import toobusy from "toobusy-js";

toobusy.maxLag(200);

export function tooBusyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (toobusy()) {
    return res.status(503).json({
      error: "Servidor sobrecarregado",
    });
  }

  next();
}