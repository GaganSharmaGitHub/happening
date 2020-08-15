import express, {Application, request, response,} from 'express'
import morgan from 'morgan'
import env from 'dotenv'
import db = require('./configs/db')
import {errorHandler} from './middlewares/errors'
//import {seedData,clearData} from './test'
//load configs
env.config({path:'./configs/config.env'})
//connect db
db.connectDB()
const app:Application= express()


//routes
import {posts} from './routes/posts'
//middlewares
app.use(morgan('dev'))
app.use(express.json())
console.log(__dirname)
app.use('/api/v1/posts', posts)
const PORT= process.env.PORT||4000
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