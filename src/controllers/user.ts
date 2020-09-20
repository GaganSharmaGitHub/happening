import {Request,Response,NextFunction} from 'express'
import {UserModel} from '../models/users'
import {PostModel} from '../models/posts'
import {ErrorResponse} from '../utils/errorResponse'
import {asyncHandler} from '../middlewares/async'

export const user= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{     
    //check user
    console.log(request.params.uid)
    const user= await UserModel.findById(request.params.uid)
    if(!user){
    return next(new ErrorResponse(404,`user not found`))
    }
    response.send({success:true,data:user})

   })
//my posts

export const myPosts= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    let reqQu={
        author:request.body.AuthorizedUser.id
    }
    //query
    let query=PostModel.find(reqQu)
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
     //execute
    const posts= await query
    console.log(posts.length)
    response.status(200)
    response.send({success:true,count:posts.length,data:posts})
})


export const follow= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    //  console.log(request.params.id)
      const post= await UserModel.findByIdAndUpdate(request.body.AuthorizedUser.id,{
          $push:{followers:request.params.id}
      },
      {
          new:true,
      }
      )
      response.status(200)
      response.send({success:true,data:post}
          )    
  })
  
  
export const unfollow= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    //  console.log(request.params.id)
      const post= await UserModel.findByIdAndUpdate(request.body.AuthorizedUser.id,{
          $push:{followers:request.params.id}
      },
      {
          new:true,
      }
      )
      response.status(200)
      response.send({success:true,data:post}
          )    
  })
  