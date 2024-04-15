import User from "../models/userSchema.js";
import ApiError from "../exceptions/api-error.js";
import genUser from "../utils/genUser.js";
import bcrypt from "bcrypt";
import messages from "../utils/messages.js";
export default new class UserService {
    async postUser(body){
        const isUSer = await User.findOne({username:body.username})
        if (isUSer)throw  ApiError.BadRequest(messages.loginAlready)
       const user = await genUser(body)
       return  await User.create(user)
    }
    async updateUser(id,body={}){
        const isUSer = await User.findByIdAndUpdate(id, {...body})
        if (!isUSer)throw  ApiError.BadRequest(messages.loginFound)
       return isUSer
    }
    async getUser(body) {
        const user = await User.findOne({username: body.username})
        if (!user) throw  ApiError.BadRequest(messages.loginFound)
        const match = await bcrypt.compare(body.password, user.password);
        if (!match) throw  ApiError.BadRequest(messages.passwordFound)
        return user
   }
    async getUserById(id) {
        const user = await User.findById(id)
        if (!user) throw  ApiError.BadRequest(messages.unknownErr)
        return user
    }
    async getUserByEmail(email) {
        const user = await User.findOne({email})
        if (!user) throw  ApiError.BadRequest(messages.emailFound)
        return user
    }
    async updatePassword(body){
        const user = await User.findOne({username:body.username})
        if (!user) throw  ApiError.BadRequest(messages.loginFound)
        const match = await bcrypt.compare(body.password, user.password);
        if (!match) throw  ApiError.BadRequest(messages.passwordFound)
        const hash = await bcrypt.hash(body.newPassword, 5)
        if (!hash) throw  ApiError.BadRequest(messages.unknownErr)
        user.password = hash
        return await user.save()
    }
    async restorePassword(email,newPassword){
        const user = await User.findOne({email})
        if (!user) throw  ApiError.BadRequest(messages.emailFound)
        const hash = await bcrypt.hash(newPassword, 5)
        if (!hash) throw  ApiError.BadRequest(messages.unknownErr)
        user.password = hash
        return await user.save()
    }
}