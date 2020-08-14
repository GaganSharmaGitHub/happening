import express, {Application,Request,Response} from 'express'
const env=require('dotenv')
//routes
//const posts=require('../routes/posts')
//load configs
env.config({path:'./configs/config.env'})
const app:Application= express()
const PORT= process.env.PORT||3000
//app.use('/api/posts',posts)
app.get('/',(a: Request,b: Response)=>{
    
})
app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})