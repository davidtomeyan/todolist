import express from "express";
const router = express.Router()
import UserController from "../controllers/UserController.js";
import isAuthMiddleware from "../middlewares/is-auth-middleware.js";
const {registration,login,isAuth,
    logout,profile,updateProfile,
    updatePassword,sendActivateToken,
    activated,hasActivateToken,
    restorePasswordToken,restorePassword,hasRestoreToken
} = new UserController()


router.get("/activate/:id",hasActivateToken)
router.get("/isauth",isAuth)
router.get("/profile/:id",isAuthMiddleware,profile)

router.put("/profile/:id",isAuthMiddleware,updateProfile)
router.put("/password/:id",isAuthMiddleware,updatePassword)

router.post("/registration",registration)
router.post("/login",login)
router.post("/activate",isAuthMiddleware,sendActivateToken)
router.post("/activate/token",isAuthMiddleware,activated)
router.post("/restore/token",restorePasswordToken)
router.get("/restore/token",hasRestoreToken)
router.post("/restore/password",restorePassword)

router.delete("/logout/:id",logout)
export default router