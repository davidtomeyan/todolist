import {validationResult, matchedData, body} from "express-validator"

import userService from "../services/UserService.js";
import tokenService from "../services/TokenService.js";
import userDtos from "../dtos/user-dtos.js";
import profileDtos from "../dtos/profile-dtos.js";
import ApiError from "../exceptions/api-error.js";
import mailServices from "../services/MailServices.js";

export default class UserController {

    async registration(req, res, next) {
        try {
            const user = await userService.postUser(req.body)
            const tokens = await tokenService.createToken(userDtos(user))
            res.cookie('token', tokens.accessToken,
                {
                    maxAge: parseInt(process.env.AGE_COOKIE),
                    httpOnly: true
                }
            )
            return res.json({isAuth: true, ...userDtos(user)})
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const user = await userService.getUser(req.body)
            const tokens = await tokenService.createToken(userDtos(user))
            res.cookie('token', tokens.accessToken,
                {
                    maxAge: parseInt(process.env.AGE_COOKIE),
                    httpOnly: true
                }
            )
            return res.json({isAuth: true, ...userDtos(user)})
        } catch (e) {
            next(e)
        }
    }

    async isAuth(req, res, next) {
        try {
            const token = req.cookies.token
            if (!token) return res.json({token: ""})
            const {user, accessToken} = await tokenService.validationAccessToken(token)
            if (accessToken) {
                return res.cookie("token", accessToken, {
                    maxAge: parseInt(process.env.AGE_COOKIE),
                    httpOnly: true
                }).json({token: accessToken, ...userDtos(user)})
            }
            res.json({token, ...userDtos(user)})
        } catch (e) {
            res.clearCookie('token', {path: "/",})
                .json({token: ""})
        }
    }

    async logout(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id)
            await tokenService.removeToken(user._id)
            res.clearCookie('token', {path: "/"})
            return res.json(userDtos(user))
        } catch (e) {
            next(e)
        }
    }

    async profile(req, res, next) {
        try {
            if (req.params.id !== req.user.id) return next(ApiError.UnauthorizedError("private"))
            const user = await userService.getUserById(req.params.id)
            return res.json(profileDtos(user))
        } catch (e) {
            next(e)
        }
    }

    async updateProfile(req, res, next) {
        try {
            if (req.params.id !== req.user.id) return next(ApiError.UnauthorizedError("private"))
            let user = await userService.updateUser(req.params.id, req.body)
            return res.json(profileDtos(user))
        } catch (e) {
            next(e)
        }
    }

    async updatePassword(req, res, next) {
        try {
            if (req.params.id !== req.user.id) return next(ApiError.UnauthorizedError("private"))
            let user = await userService.updatePassword(
                {
                    username: req.user.username,
                    password: req.body.oldPassword,
                    newPassword: req.body.newPassword,
                })
            return res.json(profileDtos(user))
        } catch (e) {
            next(e)
        }
    }

    async sendActivateToken(req, res, next) {
        try {
            const user = await userService.getUserById(req.body.id)
            const token = await mailServices.createActivateToken(req.body.id)
            const sendToken = await mailServices.sendActivate(user, token.token)
            console.log(sendToken)
            res.json({sendActivateToken: true})
        } catch (e) {
            console.log(e.message)
            next(e)
        }
    }

    async hasActivateToken(req, res, next) {
        try {
            const token = await mailServices.getToken(req.params.id)
            return res.json({isActivateToken: true})
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async activated(req, res, next) {
        try {
            const {isActivated, token} = await mailServices.validateActivateToken(req.user.id, req.body.token)
            const user = await userService.updateUser(req.user.id, {isActivated})
            if (user) await mailServices.removeToken(token)
            return res.json(profileDtos(user))
        } catch (e) {
            next(e)
        }
    }

    async restorePasswordToken(req, res, next) {
        try {
            const user = await userService.getUserByEmail(req.body.email)
            const {token} = await mailServices.createActivateToken(user.id)
            const result = await mailServices.sendActivate(user, token)
            if (token && result) {
                return res.cookie("restore", user.email, {
                    maxAge: parseInt(process.env.AGE_COOKIE_RESTORE),
                    httpOnly: true
                }).json({hasRestoreToken: true})
            }
        } catch (e) {
            next(e)
        }
    }

    async hasRestoreToken(req, res, next) {
        try {
            const email = req.cookies.restore
            if (!email) return next(ApiError.BadRequest("dont valid token"))
            const user = await userService.getUserByEmail(email)
            const token = await mailServices.getToken(user.id)
            return res.json({hasRestoreToken: true})
        } catch (e) {
            next(e)
        }
    }

    async restorePassword(req, res, next) {
        try {
            const email = req.cookies.restore
            if (!email) return next(Promise.reject(ApiError.BadRequest("dont valid token")))
            const user = await userService.getUserByEmail(email)
            const {token} = await mailServices.validateActivateToken(user.id, req.body.token)
            await userService.restorePassword(email, req.body.password)
            await mailServices.removeToken(token)
            return res.json(profileDtos(user))
        } catch (e) {
            next(e)
        }
    }
}