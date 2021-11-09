import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import connectToDatabase from "./models/index.js";
import projectRouter from './routes/projects.js';
const app = express()

const PORT = process.env.PORT || 8080;

app.use(express.json())

app.use(cors())

app.use("/", projectRouter)

connectToDatabase().then((err) => {
    if(err){
        return console.log(err)
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})