import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import passportConfig from './passports/jwtpassport'
import routes from './routes'

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(passport.initialize())

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? '*'
    : '*'
}));

app.set('trust proxy', 1);

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') dotenv.config({ path: '.env' }) 
else dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

passportConfig()

app.use(routes)

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(3001, () => {
  console.log(`${process.env.NODE_ENV || 'production'} Server started on port ${process.env.PORT}`);
})