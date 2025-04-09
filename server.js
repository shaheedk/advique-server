import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';

import connectDb from './config/db/mondodb.js'
import userRouter from './Routes/userRoutes.js'

const PORT =process.env.PORT||2000
const app=express()
await connectDb()
dotenv.config();
app.use(express.json())
app.use(cors())

app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('api working')

})
app.listen(PORT,()=>{
    console.log('server is run on http://localhost:'+PORT)
})