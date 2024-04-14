import express from "express";
const router = express.Router()
import Todo from "../models/todoSchema.js";
import genOptionsPagination from "../utils/genOptionsPagination.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import calendar from "dayjs/plugin/calendar.js";
import dayjs from "dayjs";
import "dayjs/locale/ru.js"
import ApiError from "../exceptions/api-error.js";
import isActivateToken from "../middlewares/is-activated-middleware.js";

dayjs.extend(customParseFormat)
dayjs.extend(calendar)
dayjs.locale('ru')


router.get("/",async (req,res,next)=>{
    try {
        const options = genOptionsPagination(req.query)
        const result = await Todo.paginate({user:req.user.id}, options)
        res.send(result)
    }catch (e) {
        next(ApiError.BadRequest(e))
    }
})
router.get("/statistic",async (req,res,next)=>{
    try {
        const completed = await Todo.countDocuments({
            user:req.user.id,
            completed:true,
        })
        const uncompleted = await Todo.countDocuments({
            user:req.user.id,
            completed:false,
            date:{
                $gt:dayjs().valueOf(),
            }
        })
        const urgentMatters = await Todo.countDocuments({
            user:req.user.id,
            date:{
                $gt:dayjs().valueOf(),
                $lt:dayjs().add(2,"day").valueOf()
            }})
        const missedCases = await Todo.countDocuments({
            user:req.user.id,
            date:{
                $lt:dayjs().valueOf(),
            }})
        res.json({completed,uncompleted,urgentMatters,missedCases})
    }catch (e) {
        next(ApiError.BadRequest(e))
    }
})
router.get("/:id",async (req,res,next)=>{
    try {
        const todo = await Todo.findById(req.params.id)
        const{title,body,date,id,_id,time,completed}=todo
        res.json({title,body,date,id,_id,time,completed})
    }catch (e) {
        next(ApiError.BadRequest(e))
    }
})
router.post("/",isActivateToken, async (req,res,next)=>{
   try {
       const todo = await Todo.create(req.body)
       res.json(todo)
   }catch (e) {
       next(ApiError.BadRequest(e))
   }
})
router.delete("/:id",async (req,res,next)=>{
    try {
        const todo =  await Todo.findByIdAndDelete(req.params.id)
        res.send(todo)
    }catch (e) {
        next(ApiError.BadRequest(e))
    }
})
router.put("/:id",async (req,res,next)=>{
    console.log(req.body)
    try {
        const todo =  await Todo.findByIdAndUpdate(req.params.id,{...req.body},{new:true})
        res.send(todo)
    }catch (e) {
        next(ApiError.BadRequest(e))
    }
})
 export default router