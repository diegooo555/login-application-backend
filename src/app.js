import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js'

const app = express();

app.use(morgan('dev'));
app.use(express.json());


//app.use(cookieParser());
//app.use(cors());

app.use('/users', userRoutes);



export default app;