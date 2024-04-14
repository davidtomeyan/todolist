import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const userSchema = new Schema({
    username: {type:String,required:true,unique:true},
    name: {type:String,default:"user"},
    email: {type:String,required:true,unique:true},
    prefix: {type:Number,required: true},
    phone: {type:Number,required: true,unique:true},
    password: {type:String,required: true},
    isActivated: {type:Boolean,default:false},
    agreement:{type:Boolean,required:true},
    notificationEmail:{type:Boolean,default:false,required:true}
}, { timestamps: true });
export default model("Users",userSchema)
