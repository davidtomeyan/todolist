import ApiError from "../exceptions/api-error.js";
import messages from "../utils/messages.js";
import TodoModel from "../models/todoSchema.js";
const isActivateToken = async (req,res,next)=>{
    try {
        if (!req.user.isActivated){
            const limit = await TodoModel.countDocuments()
            if (limit > 4) return next(ApiError.BadRequest(messages.activatedLimit))
        }
        next()
    }catch (e) {
        next(e)
    }
}
export default isActivateToken