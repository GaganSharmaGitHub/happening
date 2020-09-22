import {Request,Response,NextFunction} from 'express'
import {UserModel} from '../models/users'
import {PostModel} from '../models/posts'
import {ErrorResponse} from '../utils/errorResponse'
import {asyncHandler} from '../middlewares/async'
import {mailsender} from '../utils/mailsender'
//Register users

export const register= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{     
    const {name,email,password}=request.body;
    
    const user:any= await UserModel.create({name,email,password})
    sendTokenResp(user,200,response)   
   })
//login user

export const login= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{     
    const {email,password}=request.body;
    if(!email||!password){
    return    next(new ErrorResponse(400,`enter email and password`))
    }
    //check user
    const user:any= await UserModel.findOne({email}).select('+password')
    if(!user){
    return next(new ErrorResponse(404,`user not found`))
    }
    const isPwd:boolean= await user.matchPassword(password)
    //create token
    if(!isPwd){
        return next(new ErrorResponse(401,`incorrect password`))
        }
        sendTokenResp(user,200,response)
   })

   //one user
   export const forgotPassword= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{     

    const {email}=request.body;
    if(!email){
    return    next(new ErrorResponse(400,`enter email and password`))
    }
    //check user
    const user:any= await UserModel.findOne({email}).select('+password')
    if(!user){
    return next(new ErrorResponse(404,`user not found`))
    }
    const token=await user.getResetToken()
    const r= await mailsender( user.email,`  ${token}`)
    const saving= await user.save({validateBeforeSave:false})
response.status(200).send({data:r,success:true})  
})
const sendTokenResp=(user:any,status:number,res:Response)=>{
    const token=user?.getJSONWToken()
    const options={
        expires:new Date(Date.now()+
        (parseInt(`${process.env.JWT_COOKIE_EXP}`)||30)*24*60*60*1000
        ),
        httpOnly:true
    }
    user.password=undefined
    res.status(status).cookie('token',options).json({
        success: true,
        token,
        user
    })
}