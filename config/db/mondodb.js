import mongoose from 'mongoose'
import 'dotenv/config'
const connectDb=async()=>{
    try{
mongoose.connection.on("connected",()=>{
    console.log("DB connected")

})
 await mongoose.connect(`${process.env.MONGODB_URI}\advique`);

    }catch(error){
console.log('Error connecting to database:',error.message)

    }
}
export default connectDb