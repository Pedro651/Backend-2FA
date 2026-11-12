import { Router,Response,Request } from "express";
import { CreateUserController } from "./controllers/user/createUserController";
import { validateSchema } from "./middleware/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { LoginUserController } from "./controllers/user/loginUserController";
import { DetailUserController } from "./controllers/user/detailUserController";
import { isAuthenticade } from "./middleware/isAuthenticade";
import { blockSuspiciousIp } from "./middleware/blockSuspiciousIP";
import { tooBusyMiddleware } from "./middleware/toobuy";
import { rateLimiter } from "./middleware/rateMiliter";
import { StatusUser } from "./middleware/statusUser";

import "../src/worker/twoFactorWorker";
import { CodigoRecebidoController } from "./controllers/user/codigoRecebidoService";



const router = Router();

const controller = new LoginUserController();


router.use(tooBusyMiddleware);
router.use(rateLimiter);

router.post("/user" , validateSchema(createUserSchema),new CreateUserController().handle)

router.post("/session",blockSuspiciousIp, validateSchema(authUserSchema), new LoginUserController().handle)
router.post("/request-reset", controller.requestPasswordReset)
router.post("/reset-password/:token", controller.resetPassword)

router.get("/me",isAuthenticade,StatusUser, new DetailUserController().handle)


router.post("/login/2fa/send", controller.login);

router.post("/login/2fa/enviar", new CodigoRecebidoController().handle)



export {router}