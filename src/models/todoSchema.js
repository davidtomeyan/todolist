import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"
const { Schema,model } = mongoose;

const todoSchema = new Schema({
    title: {type:String,required:true}, // String is shorthand for {type: String}
    body: String,
    date: {type:Number,required: true},
    time: {type:String,required: true},
    user:{type:Schema.Types.ObjectId, ref:"Users",required:true},
    uid: {type:String,required: true},
    completed: Boolean,
}, { timestamps: true });
todoSchema.plugin(mongoosePaginate)
export default model("Todos",todoSchema)