import {Request,Response,Router,NextFunction,} from 'express'
export const errorHandler=async (error:any,request: Request,response: Response,next:NextFunction)=>{
 console.log(error.MongoError)
 let message:String=error.message;
 let code:number=error.statusCode;
if(error.name==='CastError'){
message=`Resource ${error.value} not found`
code=404
}
if(error.code===11000){
    message=`Bad request`
    code=400
    }
 response.status(code||500).json(
    {success:false,
    reason:message||'Internal server error',
}
)
}
