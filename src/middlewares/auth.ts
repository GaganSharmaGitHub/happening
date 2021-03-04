import {verify} from 'jsonwebtoken'
import {asyncHandler} from './async'
import {errorHandler} from './errors'
import {UserModel} from '../models/users'
import {Request,Response,NextFunction} from 'express'
import { ErrorResponse } from '../utils/errorResponse'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { myChatRoomsArray } from '../controllers/chatRoom'

export const protectSocket=async (socket:Socket, next:(err?: ExtendedError) => void)=>{
let token;

if (socket.request.headers.authorization && socket.request.headers.authorization.startsWith('Bearer')) {
    token = socket.request.headers.authorization.split(' ')[1]
    
    try{
        const decoded:any= verify(token, `${process.env.JWT_SECRET}`)
     const authorizedUser=(await UserModel.findById(decoded.id))
      if(!authorizedUser){
        return next(new ErrorResponse(401,'not authorized to access :('))
        }
        socket.client.request.headers.AuthorizedUser= authorizedUser.toJSON()
        const myRooms= await myChatRoomsArray(decoded.id)
      socket.client.request.headers.rooms=JSON.stringify((myRooms))
myRooms.map((roomid:string)=>{
    socket.join(roomid)
    socket.to(roomid).emit('joined',{
        content:`${(authorizedUser as any).name} joined`,
        user:authorizedUser,
    })
}
)
     return   next()
    }catch(e){
        return next(new ErrorResponse(401,'could not authorise :('))
    }
}
        return next(new ErrorResponse(401,'could not authorise :('))
}


export const protect=asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{     
    let token
    request.body.AuthorizedUser=null;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        token = request.headers.authorization.split(' ')[1]
    } else if(request.cookies.token){
        token = request.cookies.token
    }
    if(!token){
        return next(new ErrorResponse(401,'no authorization provided :('))
    }
    try{
        const decoded:any= verify(token, `${process.env.JWT_SECRET}`)
      //  console.log(decoded)
        request.body.AuthorizedUser=await UserModel.findById(decoded.id)
        if(!request.body.AuthorizedUser){
        return next(new ErrorResponse(401,'not authorized to access :('))
        }
        next()
    }catch(e){
        return next(new ErrorResponse(401,'could not authorise :('))

    }
   })
