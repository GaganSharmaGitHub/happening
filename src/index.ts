import express, {Application, Request, Response,NextFunction} from 'express'
import morgan from 'morgan'
import http from 'http';
import {Server,Socket} from 'socket.io'
import env from 'dotenv'
import db = require('./configs/db')
import {errorHandler} from './middlewares/errors'
import cookieP from 'cookie-parser'
import * as k from 'jsonwebtoken'
const fileUp=require('express-fileupload');
//import {seedData,clearData} from './test'
//load configs
if(!process.env.MONGO_URI){
    env.config({path:'./configs/config.env'})
}
//connect db
db.connectDB()
const app:Application= express()
//routes
import {posts} from './routes/posts'
import {userR} from './routes/auth'
import {trendRoute} from './routes/trending'
import {chatroom} from './routes/chatRoom'
import { protectSocket } from './middlewares/auth';
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
app.use('/api/v1/chatroom', chatroom)
app.use('/api/v1/trending', trendRoute)


const PORT= process.env.PORT||4500

//error handling
app.use(errorHandler)
/** Create HTTP server. */
const server = http.createServer(app);
//const io= socketio.listen(server);
//io.on('connection', console.log)
/** Listen on provided port, on all network interfaces. */
const io =new Server(server, {
  cors: { origin: "*", }
});

const chatio= io.of('/chats')
chatio.use(protectSocket)
 chatio.on('connection', (socket:Socket) => {
   let user=(socket.client.request.headers.AuthorizedUser as any);
  
 socket.join(`to ${user._id}`)
  chatio.emit('message', `${(socket.client.request.headers.AuthorizedUser as any).name} joined` );   

  socket.on('message', (message:any) =>     {
    const {content}= message;
    console.log(k.sign(
      {
          id: message.to},
          `${process.env.JWT_SECRET}`,
          {expiresIn:`${process.env.JWT_EXP}`,}
          ))
    
chatio.to(`to ${message.to}`).emit(`message`,
{
  content,
  sender:user,
  from:user._id,
})
    //  chatio.emit('message', `${user.name} said ${message}` );   
  });
})
server.listen(PORT,()=>{
    console.log(`Flying ✈  ✈  ✈  on ${PORT}`)
});

//handle rejections
process.on('unhandledRejection',(err:any,promise:any)=>{
    console.log(`error!! 😞😞 ${err.name}: ${err.message}`)
    //close and exit
    server.close(()=>process.exit(1))
})