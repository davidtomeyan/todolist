import jwt from "jsonwebtoken";
export default function (token) {
    const user = {
        id:"",
        token:"",
        username:"",
        email:""
    }
    if (token){
        const {id:_id,username,email} = jwt.decode(token)
        return {...user,token,username,email}
    }
}