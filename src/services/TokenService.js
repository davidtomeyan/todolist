import TokenModel from "../models/tokenSchema.js";
import jwt from "jsonwebtoken"
import ApiError from "../exceptions/api-error.js";
import userDtos from "../dtos/user-dtos.js";
import User from "../models/userSchema.js";


export default new class {
    genTokens(data){
      const accessToken = jwt.sign({...data}, process.env.ACCESS_KEY,{ expiresIn:30 });
      const refreshToken = jwt.sign({...data}, process.env.REFRESH_KEY,{ expiresIn: "30m" });
      return{refreshToken,accessToken}
    }
    async createToken(user){
        const tokens = this.genTokens(user)
        const isRefresh = await TokenModel.findOne({user:user.id})
        if (isRefresh){
            isRefresh.token = await tokens.refreshToken
            isRefresh.save()
            return tokens
        }else {
           await TokenModel.create({
                user:user.id,
                token:tokens.refreshToken
            })
            return tokens
        }
    }
    async validationAccessToken(token){
        try {
            const decoded =  jwt.verify(token,process.env.ACCESS_KEY)
            return {user:decoded}
        }catch (e) {
            const user = jwt.decode(token)
            const isRefresh = await TokenModel.findOne({user:user.id})
            if (!isRefresh) {
                throw ApiError.UnauthorizedError()
            }
          return  await this.validationRefreshToken(isRefresh)
        }
    }
    async validationRefreshToken({token}){
        try {
            const decoded = jwt.verify(token,process.env.REFRESH_KEY)
            const user = await User.findById(decoded.id)
            if (!user)return Promise.reject()
            const {accessToken} = await this.createToken(userDtos(user))
            return {accessToken,user:userDtos(user)}
        }catch (e) {
            const decoded = jwt.decode(token,process.env.REFRESH_KEY)
            await this.removeToken(decoded.id)
            return Promise.reject(e)
        }
    }
    async removeToken (id){
        console.log(id)
        const deletedToken = await TokenModel.findOneAndDelete({user:id})
        if (!deletedToken) throw ApiError.BadRequest()
        return deletedToken
    }
}