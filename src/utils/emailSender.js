import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});


const sendVerificationEmail=async(email,user)=>{
    try{

    const mailConfigurations = {
        from: process.env.EMAIL_USERNAME, // Sender email address
        to: email,     // Recipient email address
        subject: 'Almost There! Complete Your Registration with This Code',    // Email subject
        text: `
        Hi ${user.firstName}

        You've recently visited our website and entered your email. Here's your verification code for riderProvider:

        ${user.verificationcode}

        Your adventure awaits! Verify your email and let's get moving!
        cheers,
        The RiderProvider Team`                    // Email body text
    };
    const info=await transporter.sendMail(mailConfigurations);
    console.log("code has been sent to mail successfully");
    return info.messageId
    }
    catch(error){
        throw new Error(error);
        
    }
}

export {sendVerificationEmail}

