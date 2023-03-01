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

    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: process.env.MY_EMAIL,
        to: process.env.MY_EMAIL,
        subject: 'New Email from Your Website',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});

connectToDatabase().then((err) => {
    if (err) {
        return console.log(err)
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})