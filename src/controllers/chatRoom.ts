import {Request,Response,NextFunction} from 'express'
import {ChatModel} from '../models/chatRooms'
import {Document} from 'mongoose'
import {ErrorResponse} from '../utils/errorResponse'
import {asyncHandler} from '../middlewares/async'

export const myChatRoomsArray=async (uid:string):Promise<string[]>=> {
    let toSend:string[]=[];
  const k= await ChatModel.find({members: { "$in" : [uid]}} );
  const blocked:any[]=(k as any).blockedBy ||[];
k.map((doc:Document)=>{
if(!blocked.includes(uid)){
toSend.push(`${doc._id}`)
}
})
    return toSend;
}

export const myChatRooms=asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    let reqQu={...request.query}
    const fieldsToRemove:string[]=['sort','page','limit',]
    fieldsToRemove.forEach((k)=>{
        delete reqQu[k]
    })
    //query
    let query=ChatModel.find({members: { "$in" : [request.body.AuthorizedUser.id]}} ).populate('members')
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
     const totalDocs:number= await ChatModel.countDocuments()
     query.skip(skip).limit(limit)
     pagination.totalPages=Math.ceil(totalDocs/limit)
     pagination.nextPage= skip<totalDocs? {page:page+1,limit}:undefined
     pagination.previousPage= skip>0? {page:page-1,limit}:undefined
     pagination.currentPage= skip>0? {page,limit}:undefined

     //execute
    const chats= await query
    console.log(chats.length)
    response.status(200)
    response.send({success:true,count:chats.length,data:chats,pages:pagination})
})



//create room
export const createRoom= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{     
    request.body.author=request.body.AuthorizedUser.id
   let {author,otherusers,title}=request.body
   let users=[]
   users.push(author)
  users= users.concat(otherusers)
   console.log(users)
    const data= await ChatModel.create({members:users,title})  
    response.status(201).json({success: true,data})   
})

//join room
export const addToRoom=asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    request.body.author=request.body.AuthorizedUser.id
    let {author,otherusers}=request.body
    
    const chat= await ChatModel.findOneAndUpdate({_id:request.params.id,members: { "$in" : [request.body.AuthorizedUser.id]}},
    { $addToSet: { members: { $each: otherusers } } },{new:true,})
      
    if(!chat){
        return next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
      response.status(200)
      response.send({success:true,data:chat}
          )    
  })


//join room
export const joinRoom=asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    const chat= await ChatModel.findOneAndUpdate({_id:request.params.id},{
        $addToSet:{members:request.body.AuthorizedUser.id}
      },{new:true,})
      
    if(!chat){
        return next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
      response.status(200)
      response.send({success:true,data:chat}
          )    
  })


//leave room
export const leaveRoom=asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    const chat= await ChatModel.findOneAndUpdate({_id:request.params.id},{
        $pullAll:{members:request.body.AuthorizedUser.id}
      },{new:true,})
      
    if(!chat){
        return next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
      response.status(200)
      response.send({success:true,data:chat}
          )    
  })



//get a room
export const getRoom=asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    //  console.log(request.params.id)
    const chat= await ChatModel.findOne({_id:request.params.id,members:request.body.AuthorizedUser.id})
    if(!chat){
        response.status(404)
        response.send({success:true,reason:'chat not found'})

    }
        response.status(200)
      response.send({success:true,data:chat}
          )    
  })

//block a room
   export const block=asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    const chat= await ChatModel.findOneAndUpdate({_id:request.params.id},{
        $addToSet:{blockedBy:request.body.AuthorizedUser.id}
      },
      {
          new:true,
      }
      )
      
    if(!chat){
        return next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
      response.status(200)
      response.send({success:true,data:chat}
          )    
  })

  //unblock room
  export const unblock= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    const chat= await ChatModel.findOneAndUpdate({_id:request.params.id,},{
        $pullAll:{blockedBy:request.body.AuthorizedUser.id}
    },
    {
        new:true,
    }
    )
    
    if(!chat){
        return next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
    response.status(200)
    response.send({success:true,data:chat}
        )    
})

//delete one chat
export const deleteChat= asyncHandler(async(request: Request,response: Response,next:NextFunction)=>{
    const chat= await ChatModel.findOneAndDelete({_id:request.params.id,},)
    
    if(!chat){
        return next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
    response.status(200)
    response.send({success:true,data:{}})   
})