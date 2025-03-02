import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import recoveryRoutes from './routes/recovery.routes.js';

const app = express();
const URL_FRONTEND = process.env.FRONTEND_URL;

const corsOptions = {
    origin: URL_FRONTEND,
    credentials: true,
};

app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', userRoutes);
app.use(recoveryRoutes);



export default app;