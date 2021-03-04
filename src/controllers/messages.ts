import {Request,Response,NextFunction} from 'express'
import {MessageModel} from '../models/messages'
import {ErrorResponse} from '../utils/errorResponse'
import {asyncHandler} from '../middlewares/async'
import {Message} from '../interfaces/message'

export const addMessage=async(message:Message)=>{
    await MessageModel.create(message)
};
//get all messages
export const getMessages= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    console.log('getting')
    let reqQu={...request.query}
    const fieldsToRemove:string[]=['select','sort','page','limit',]
    fieldsToRemove.forEach((k)=>{
        delete reqQu[k]
    })
    //query
    let query=MessageModel.find(reqQu)
    if(request.query.select){
    const field=`${request.query.select}`.split(',').join(' ')
    query=query.select(field)
    }
    //select fields
    if(request.query.select){
        const field=`${request.query.select}`.split(',').join(' ')
        query=query.select(field)
        }
    //sort
    if(request.query.sort){
        const sorts=`${request.query.sort}`.split(',').join(' ')
        query=query.sort(sorts)
     }else{
        query=query.sort('-createdAt')
     }
     //pagination
     let pagination:any={};     
     const page:number= parseInt(`${request.query.page}`)||1
     const limit:number= parseInt(`${request.query.limit}`)||50
     const skip:number=(page-1)*limit
     const totalDocs:number= await MessageModel.find({room:reqQu.room}).countDocuments()
     query.skip(skip).limit(limit)
     pagination.totalPages=Math.ceil(totalDocs/limit)
     pagination.nextPage= skip<totalDocs? {page:page+1,limit}:undefined
     pagination.previousPage= skip>0? {page:page-1,limit}:undefined
     pagination.currentPage= skip>0? {page,limit}:undefined

     //execute
    const messages= await query
    response.status(200)
    response.send({success:true,count:messages.length,data:messages,pages:pagination})
})

//delete one message
export const deleteMessage= asyncHandler(async(request: Request,response: Response,next:NextFunction)=>{

    request.body.author=request.body.AuthorizedUser.id
    const message= await MessageModel.findOneAndDelete({_id:request.params.id,from:request.body.author},)
    
    if(!message){
        next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
    response.status(200)
    response.send({success:true,data:{}})   
})