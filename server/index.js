import express from 'express'
import connectDB from './config/db.js';
import authRoute from './routes/authRouth.js'
import cors from 'cors';

const app= express();

app.use(cors());
app.use(express.json());
const PORT=process.env.PORT || 9000;

connectDB();

app.get("/",(req,res)=>{
    res.send("Backend is running");
})

app.use('/api/auth',authRoute);

app.listen(PORT, ()=>{
    console.log("Server eastablished");
})