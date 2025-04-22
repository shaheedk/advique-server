import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import chatRoutes from './Routes/chatRouter.js'
import connectDb from './config/db/mondodb.js'
import userRouter from './Routes/userRoutes.js'

dotenv.config(); // move this to top if not already

const PORT = process.env.PORT || 2000;
const app = express();

await connectDb();
app.use(express.json());
app.use(cors());

// Your routes
app.use('/api/user', userRouter);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('api working');
});

app.listen(PORT, () => {
    console.log('server is run on http://localhost:' + PORT);
});
