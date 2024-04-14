export default class ApiError extends Error{
    status;
    errors;
    originalStatus;

    constructor(originalStatus,status,massage,errors=[],) {
        super(massage);
        this.errors = errors
        this.status = status
        this.originalStatus = originalStatus
    }
    static UnauthorizedError(message){
        return new ApiError(401,"user unauthorized",message)
    }
    static BadRequest(massage,errors=[]){
        return new ApiError(400,"Bad Request",massage,errors)
    }
}