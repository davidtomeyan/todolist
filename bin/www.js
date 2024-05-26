import mongoose from "mongoose";
import app from "../src/app.js";
import 'dotenv/config'

const port = 80
const connectionString = 'mongodb://gen_user:RG%7C%3Be%5C%5C*h7Hk~1@94.241.138.162:27017/default_db?authSource=admin&directConnection=true';   
async function main() {
    try {
        await mongoose.connect(connectionString)
        app.listen(port)
        console.log("Сервер ожидает подключения...");

    }catch (err) {
        console.log(err);
        return err
    }
}

main().then(()=> console.log(`Example app listening on port ${port}`)
).catch(err => console.log(err));

process.on("SIGINT", async() => {
    await mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
});
