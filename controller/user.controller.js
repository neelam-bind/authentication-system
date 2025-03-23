import User from '../model/User.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


//register user
const registeredUser = async (req, res) => {
    //get data
    //validate
    //check if the user already exists
    //create a user in database
    //save token in database
    //send tokem as email to user
    //send success status to user 

    const {name , email, password} = req.body;

    if(!name || !email || !password) {         //yeh improve krna hai (zod bhi try kr sakti hai) 
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    try{
        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const user = await User.create({name, email, password});
        if(!user){
            return res.status(400).json({
                message: "User not created"
            });
        }
        console.log("User", user);

        const token = crypto.randomBytes(32).toString('hex');
        console.log("Token", token);
        user.verificationToken = token;
        await user.save();

        //send email
        const transport = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,
            auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
            }
        });

        const mailOptions = {
            from: process.env.MAILTRAP_SENDER,
            to: user.email,
            subject: "verify the email",
            text: `Click on the link to verify the email: ${process.env.BASE_URL}/api/v1/users/verify/${token}`
        };

        try {
            const info = await transport.sendMail(mailOptions);
            console.log("Email sent successfully:", info.response);
        } catch (error) {
            console.error("Error sending email:", error);
        }
        

        return res.status(200).json({
            message: "User regitered successfully",
            success: true
        });
        
    }catch(error){
        console.error("Error registering user:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error
        });
    }
};


//verify user
const verifyUser = async (req, res) => {
    //get token from url
    //validate the token
    //find the user with token
    //update the isVerified field
    //remove the verification token from database
    //save the user changes in database



    const token  = req.params.token;

    console.log("Token", token);
    if(!token){
        return res.status(400).json({
            message: "invalid token"
        });
    }
    const user = await User.findOne({verificationToken: token});
    if(!user){
        return res.status(400).json({
            message: "User not found"
        });
    }
    //changes in user
    user.isVerified = true;
    user.verificationToken = "";

    await user.save();
    return res.status(200).json({
        message: "User verified successfully",
        success: true
    });
};

//user login 
const login = async (req, res) => {
    //get user credentials from request body(username, password)
    //validate the credentials
    //find the user with username
    //compare the password
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        const userVerified = user.isVerified;
        if(!userVerified){
            return res.status(400).json({
                message: "User not verified"
            });
        }

        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token =jwt.sign({id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '24h'});
    
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(
            Date.now() + Number(process.env.JWT_COOKIE_EXPIREs) * 24 * 60 * 60 * 1000
        ),        
        secure:false 
    }; 
    res.cookie("token",token,cookieOptions);
    res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token,
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });

    }catch(error){
        console.error("Error logging in user:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message || error
        });
    }
};




export { registeredUser ,verifyUser, login};