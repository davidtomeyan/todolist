import ApiError from "../exceptions/api-error.js";
import genErrorMessage from "../utils/genErrorMessege.js";
export default function (err,req,res,next) {
    if (err instanceof ApiError){
        return res.status(err.originalStatus).json(genErrorMessage(err))
    }
     return res.status(500).json(genErrorMessage(err))
}