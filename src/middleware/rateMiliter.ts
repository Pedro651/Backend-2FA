import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // máximo de 100 requisições por IP
  message: {
    error: "Muitas requisições. Tente novamente mais tarde."
  },
  standardHeaders: true,
  legacyHeaders: false
});