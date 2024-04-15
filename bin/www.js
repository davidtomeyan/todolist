import mongoose from "mongoose";
import app from "../src/app.js";
import 'dotenv/config'

const port = process.env.PORT||8080

async function main() {
    try {
        await mongoose.connect(process.env.DB_URL+"todo")
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