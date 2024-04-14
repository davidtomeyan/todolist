import User from "../models/userSchema.js";
import ApiError from "../exceptions/api-error.js";
import genUser from "../utils/genUser.js";
import bcrypt from "bcrypt";

export default new class UserService {
    async postUser(body){
        const isUSer = await User.findOne({username:body.username})
        if (isUSer)throw  ApiError.BadRequest("user true")
       const user = await genUser(body)
       return  await User.create(user)
    }
    async updateUser(id,body={}){
        const isUSer = await User.findByIdAndUpdate(id, {...body})
        if (!isUSer)throw  ApiError.BadRequest("user false")
       return isUSer
    }
    async getUser(body) {
        const user = await User.findOne({username: body.username})
        if (!user) throw  ApiError.BadRequest("user false")
        const match = await bcrypt.compare(body.password, user.password);
        if (!match) throw  ApiError.BadRequest("password false")
        return user
   }
    async getUserById(id) {
        const user = await User.findById(id)
        if (!user) throw  ApiError.BadRequest("user false")
        return user
    }
    async getUserByEmail(email) {
        const user = await User.findOne({email})
        if (!user) throw  ApiError.BadRequest("dont registration email")
        return user
    }
    async updatePassword(body){
        const user = await User.findOne({username:body.username})
        if (!user) throw  ApiError.BadRequest("user false")
        const match = await bcrypt.compare(body.password, user.password);
        if (!match) throw  ApiError.BadRequest("password false")
        const hash = await bcrypt.hash(body.newPassword, 5)
        if (!hash) throw  ApiError.BadRequest("woops")
        user.password = hash
        return await user.save()
    }
    async restorePassword(email,newPassword){
        const user = await User.findOne({email})
        if (!user) throw  ApiError.BadRequest("user false")
        const hash = await bcrypt.hash(newPassword, 5)
        if (!hash) throw  ApiError.BadRequest("woops")
        user.password = hash
        return await user.save()
    }
}