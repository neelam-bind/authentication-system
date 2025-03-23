import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => { 
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("error connecting to database", err);
    });
}

export default db;