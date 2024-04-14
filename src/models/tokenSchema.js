import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const tokenSchema = new Schema({
    user: {type:Schema.Types.ObjectId,ref:"Users",required:true,unique:true},
    token:{type: String,required: true}
}, { timestamps: true });
export default model("Token",tokenSchema)