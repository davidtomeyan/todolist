import ApiError from "../exceptions/api-error.js";

import TodoModel from "../models/todoSchema.js";
const isActivateToken = async (req,res,next)=>{
    try {
        if (!req.user.isActivated){
            const limit = await TodoModel.countDocuments()
            if (limit > 4) return next(ApiError.BadRequest("yor limit 5"))
        }
        next()
    }catch (e) {
        next(e)
    }
}
export default isActivateToken