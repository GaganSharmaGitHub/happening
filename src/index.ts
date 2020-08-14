import express, {Application,} from 'express'
import morgan from 'morgan'
import env from 'dotenv'
import db = require('./configs/db')
//load configs
env.config({path:'./configs/config.env'})

//connect db
db.connectDB()

const app:Application= express()

//routes
import {posts} from './routes/posts'

//middlewares

app.use(express.json)
app.use(morgan('dev'))
//mounting routers
app.get('/',(r:any,q:any)=>{
q.send('oyeees')
})
app.use('/api/v1/posts', posts)
const PORT= process.env.PORT||4000

const server= app.listen(PORT,()=>{
    console.log(`Flying ✈  ✈  ✈  on ${PORT}`)
})
//handle rejections
process.on('unhandledRejection',(err:Error,promise:Promise<any>)=>{
    console.log(`error!! 😞😞 ${err.name}: ${err.message}`)
    //close and exit
    server.close(()=>process.exit(1))
})