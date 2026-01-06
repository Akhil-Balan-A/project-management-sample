import express from 'express';
import homePage from './constants/homePage.js';
import instagram from './constants/instagram.js';
import path from 'path';
import { fileURLToPath } from "url";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

//basic configs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' })); 
app.use(express.static(path.join(__dirname, "..", "public")));

//cookie parser
app.use(cookieParser());

//cors config
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    
}));

//import the routes from routes
import healthCheckRouter from './routes/healthCheck.route.js';
import authRouter from './routes/auth.routes.js';

//use the routes
app.use('/api/v1/healthcheck', healthCheckRouter);
app.use('/api/v1/auth', authRouter);


/////test routes only
app.get('/', (req, res) => {
    res.send(homePage);
});

app.get('/instagram',(req, res)=> {
    res.send(instagram);
})

export default app;


