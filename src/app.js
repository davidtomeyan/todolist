import express from "express"
import todo from "./routes/todo.js";
import users from "./routes/users.js";
import cors from "cors"
import errorMiddleware from "./middlewares/error-middleware.js";
import cookieParser from "cookie-parser"
import validateToken from "./middlewares/is-auth-middleware.js";
import logErrors from "./middlewares/log-error.js";
import * as url from 'url';
import * as path from "path";

const app = express()


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const staticPath = path.join(__dirname, "..", "public/build")
const rootFilePath = path.join(__dirname, "..", "public/build/index.html")
var options = {
    extensions: ['htm', 'html'],
    index: true,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}
app.use(cors({
    credentials: true,
    origin: "http://todo.tomeyan.ru/"
}))
app.use(express.static(staticPath))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use("/api/todos", validateToken, todo)
app.use("/api/", todo)
app.use("/api/users", users)
app.get("*", (req, res) => {
    res.sendFile(rootFilePath)
})
app.use(logErrors)
app.use(errorMiddleware)
export default app


