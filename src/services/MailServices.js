import nodemailer from "nodemailer"
import activateTokenModel from "../models/activateTokenSchema.js";
import { v4 as uuidv4 } from 'uuid';
import ApiError from "../exceptions/api-error.js";
export default new class {
    constructor() {
        this.sendActivate = this.sendActivate.bind(this)
    }
   async sendActivate(user,token) {
      return await this.transporter().sendMail({
            from: '"localhost.ru" <tomeuan@mail.ru>',
            to: [user.email],
            subject: `Hello ${user.username}✔`,
            html: `<body>
                        <h1>How to copy token</h1>
                            <p>${token}</p>
                   </body>  `,
        }).then(value => {
              if (value)return value
          }).catch(err=>{
             if (err) throw ApiError.BadRequest(err.response)
          })
    }
    async createActivateToken(userId){
        try {
            const token = await activateTokenModel.findOne({user:userId})
            if (token){
                token.token = uuidv4()
                return await token.save()
            }
            const cratedToken =  await activateTokenModel.create({
                user:userId,
                token:uuidv4()
            })

            const timout = setTimeout(async ()=>{
                await activateTokenModel.findOneAndDelete({user:userId})
            },180*1000)

            clearTimeout(timout)
            return cratedToken
        }catch (e) {
            throw ApiError.BadRequest(e)
        }
    }
    async validateActivateToken(userId,verifyToken){
        try {
            const data = await activateTokenModel.findOne({user:userId})
            if (!data) {
                return Promise.reject(ApiError.BadRequest("dont created token activated"))
            }
            if (data.token!==verifyToken){
                return Promise.reject(ApiError.BadRequest("dont valid token"))
            }
            if (data.token===verifyToken){
                return Promise.resolve({isActivated:true,token:verifyToken})
            }
        }catch (e) {
            console.log(e)
            throw ApiError.BadRequest(e)
        }
    }
    async getToken(userId){
        try {
            const data = await activateTokenModel.findOne({user:userId})
            if (!data) {
                return Promise.reject(ApiError.BadRequest("dont created token"))
            }
        }catch (e) {
            throw ApiError.BadRequest(e)
        }
    }
    async removeToken(token){
        try {
            return  await activateTokenModel.findOneAndDelete({token})
        }catch (e) {
            throw ApiError.BadRequest(e)
        }
    }
    transporter(){
        return nodemailer.createTransport({
            host: 'smtp.mail.ru',
            pool: true,
            port: 465,
            secure: true,
            auth: {
                user: "tomeuan@mail.ru",
                pass: "BQ1UGm8Xgi206RaAPiC1",
        },
            tls: {
            rejectUnauthorized: false,
        },
    })}
}