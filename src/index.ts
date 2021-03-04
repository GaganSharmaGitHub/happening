import express, {Application, Request, Response,NextFunction} from 'express'
import morgan from 'morgan'
import http from 'http';
import {Server,Socket} from 'socket.io'
import env from 'dotenv'
import db = require('./configs/db')
import {errorHandler} from './middlewares/errors'
import cookieP from 'cookie-parser'
import {Message} from './interfaces/message'
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
import { addMessage } from './controllers/messages';
import { messageRouter } from './routes/message';
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
app.use('/api/v1/message', messageRouter)


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
  
    socket.on('chat-message', (message:any) =>{
      try{
        const messageInt:Message=message;
        messageInt.from=user._id
        messageInt.createdAt=Date.now()
        messageInt.type=messageInt.type||'text'
        chatio.to(`${messageInt.room}`).emit(`chat-message`,messageInt)
          addMessage(messageInt)
      }catch(e){

      }
  }
  );
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