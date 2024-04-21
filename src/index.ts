import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import { connectDb } from './db/db'
import router from './routes'

import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors({
  credentials: true,
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api/', router())

const server = http.createServer(app)
connectDb()

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080/')
})