import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());
app.use(cookieParser());

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? '*'
    : '*'
}));

app.set('trust proxy', 1);