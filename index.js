import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import connectToDatabase from "./models/index.js";
import projectRouter from './routes/projects.js';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

const app = express()

const PORT = process.env.PORT || 8080;

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())

app.use("/", projectRouter)

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    let MailTransporter = nodemailer.createTransport({

        service: "gmail",
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    let MailOptions = {
        from: process.env.GMAIL,
        to: process.env.MY_EMAIL,
        subject: `New email from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    }

    MailTransporter.sendMail(MailOptions, (err) => {
        if (err) {
            console.log(err.message)
        }

        else {
            console.log("Email Sent")
            return res.status(200).json({ message: "Email Sent" })
        }
    })
});

connectToDatabase().then((err) => {
    if (err) {
        return console.log(err)
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})