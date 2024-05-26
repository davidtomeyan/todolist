import ApiError from "../exceptions/api-error.js";
import TokenService from "../services/TokenService.js";
import userDtos from "../dtos/user-dtos.js";
import messages from "../utils/messages.js";
 const isValidateToken = (req,res,next)=>{
    if (!req.cookies.token){
        throw ApiError.UnauthorizedError(messages.notAuthorized)
    }
    const isAuth = TokenService.validationAccessToken(req.cookies.token)
    isAuth.then((u)=>{
        req.user = userDtos(u.user)
        if (u.accessToken) {
            res.cookie('token', u.accessToken,
                {
                    maxAge: parseInt(process.env.AGE_COOKIE),
                    path: "/",
                }
            )
        }
        next()
    }).catch(()=> {
        res.clearCookie("token")
        return next(ApiError.UnauthorizedError(messages.notAuthorized))
        }
    )
}
export default isValidateToken