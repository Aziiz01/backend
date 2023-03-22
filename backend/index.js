import express from "express"
import cors from "cors"
import path from "path"
import fileUpload from "express-fileupload"
import ProductRoute from "./routes/ProductRoute.js"

const app = express()


app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static("public"));
app.use(ProductRoute);




app.listen(8000, ()=> {
    console.log("connected to backend!!!")
})