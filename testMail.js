import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.sendMail({
    from: `"Test" <${process.env.EMAIL_USER}>`,
    to: "suryadeep.inc@gmail.com",
    subject: "Test Email",
    text: "Hello world",
})
    .then(() => console.log("Email sent"))
    .catch(err => console.log(err));
