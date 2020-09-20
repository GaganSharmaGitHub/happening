import {verify} from 'jsonwebtoken'
import {asyncHandler} from './async'
import {errorHandler} from './errors'
import {UserModel} from '../models/users'
import {Request,Response,NextFunction} from 'express'
import { ErrorResponse } from '../utils/errorResponse'

export const protect=asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{     
    let token
    request.body.AuthorizedUser=null;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        token = request.headers.authorization.split(' ')[1]
    } else if(request.cookies.token){
        token = request.cookies.token
    }
    if(!token){
        return next(new ErrorResponse(401,'not authorized to access'))
    }
    try{
        const decoded:any= verify(token, `${process.env.JWT_SECRET}`)
      //  console.log(decoded)
        request.body.AuthorizedUser=await UserModel.findById(decoded.id)
        if(!request.body.AuthorizedUser){
        return next(new ErrorResponse(401,'not authorized to access'))
        }
        next()
    }catch(e){
        return next(new ErrorResponse(401,'not authorized to access'))

    }
   })
