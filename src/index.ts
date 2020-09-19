import express, {Application, request, response,} from 'express'
import morgan from 'morgan'
import env from 'dotenv'
import db = require('./configs/db')
import {errorHandler} from './middlewares/errors'
import cookieP from 'cookie-parser'
const fileUp=require('express-fileupload');
//import {seedData,clearData} from './test'
//load configs
env.config({path:'./configs/config.env'})
//connect db
db.connectDB()
const app:Application= express()


//routes
import {posts} from './routes/posts'
import {userR} from './routes/auth'
//middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(fileUp())
app.use(cookieP())
//import {clearData,seedData} from './test'
//clearData()
//seedData()


app.use('/api/v1/posts', posts)
app.use('/api/v1/users', userR)
const PORT= process.env.PORT||4500
//error handling
app.use(errorHandler)
const server= app.listen(PORT,()=>{
    console.log(`Flying ✈  ✈  ✈  on ${PORT}`)
})
//handle rejections
process.on('unhandledRejection',(err:any,promise:any)=>{
    console.log(`error!! 😞😞 ${err.name}: ${err.message}`)
    //close and exit
    server.close(()=>process.exit(1))
})