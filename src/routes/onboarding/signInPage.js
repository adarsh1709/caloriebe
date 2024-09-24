import { Router } from "express";
import { User } from "../../../models/user.js";
import { sendVerificationEmail } from "../../utils/emailSender.js";
import { DATE, Op } from "sequelize";
const router = new Router();

router.post('/api/v1/signup',async (req,res)=>{
    try{
        var {phnumber,email,username,firstname,lastname,dateofbirth,gender,password,age}= req.body;

        /**check if phoneNumber already exists */
        const isExists=await User.findOne({
            where:{
                [Op.and]:{
                    [Op.or]:{
                        phnumber,
                        email,
                        username   
                    },
                    emailverified:true
                }
            }
        });
        if(isExists){
            return res.status(400).json({ error: 'Phone number already exists' });
        }
        dateofbirth=new DATE(dateofbirth);
        /** generate verification code */
        const verificationcode =(Math.floor(Math.random() * 10000)).toString().padStart(4,'0'); // Generate random code
        const verificationexpires = new Date();
        verificationexpires.setHours(verificationexpires.getMinutes() + 10); 
        const newUser= await User.create({
            username,
            phnumber,
            firstname,
            lastname,
            dateofbirth,
            gender,
            password,
            verificationcode,
            verificationexpires,
            age,
            email
        })
        await sendVerificationEmail(email, newUser);
        res.status(201).json({ message: 'User created. Check your email for verification.' });
    }
    catch(error){
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/api/v1/verify',async (req,res)=>{
    try{
        console.log(req.query);
        
        const verificationcode=req.query.code;
        const email=req.query.email.toString();

        /**check if phoneNumber already exists */
        const user=await User.findOne({where:{email},order:[['createdAt','DESC']]});
        console.log(user);
        
        if(!user && user.verificationcode!=verificationcode){
            return res.status(400).json({ error: 'Invalid verfication code' });
        }
        if (user.verificationexpires < new Date()) {
            return res.status(400).json({ error: 'Verification code has expired' });
        }
        await user.update({ emailverified: true })    
        res.status(201).json({ message: 'Email Verified.Welcome to riderProvide' });
    }
    catch(error){
        console.error('Error in code verification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.get('/api/v1/sigin',async (req,res)=>{
    try{
        console.log(req.query);
        
        const password=req.query.password;
        const email=req.query.email;

        /**check if phoneNumber already exists */
        const user=await User.findOne({where:{email,emailverified:true}});
        if(!user){
            return res.status(404).json({ error: 'user does not exist' });
        }
        const check=await user.validatePassword(password)
        if (!check) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }   
        res.status(201).json({ message: 'login successfull' });
    }
    catch(error){
        console.error('Error in code verification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


export {router};