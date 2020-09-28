import {Request,Response,NextFunction} from 'express'
import {UserModel} from '../models/users'
import {PostModel} from '../models/posts'
import {ErrorResponse} from '../utils/errorResponse'
import {asyncHandler} from '../middlewares/async'
const cloudinary=require('cloudinary')
export const user= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{     
    //check user
    const user= await UserModel.findById(request.params.uid).populate('followers')
    if(!user){
    return next(new ErrorResponse(404,`user not found`))
    }
    response.send({success:true,data:user})

   })
   export const lookup= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    let reqQu={...request.query}
    const fieldsToRemove:string[]=['select','sort','page','limit',]
    fieldsToRemove.forEach((k)=>{
        delete reqQu[k]
    })
    console.log(reqQu)
    //query
    let query=UserModel.find(reqQu)
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
     query.skip(skip).limit(limit)
     pagination.nextPage= {page:page+1,limit}
     pagination.previousPage= skip>0? {page:page-1,limit}:undefined
     pagination.currentPage= skip>0? {page,limit}:undefined

     //execute
    const users= await query
    console.log(users.length)
    response.status(200)
    response.send({success:true,count:users.length,data:users,pages:pagination})
})


export const follow= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    //  console.log(request.params.id)
      const post= await UserModel.findByIdAndUpdate(request.body.AuthorizedUser.id,{
        $addToSet:{followers:request.params.id}
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
          $pull:{followers:request.params.id}
      },
      {
          new:true,
      }
      )
      response.status(200)
      response.send({success:true,data:post}
          )    
  })

  export const updateUser= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    let n={...request.body}
    const fieldsToRemove:string[]=['email','password','createdAt','resetPasswordToken','resetExpire','followers']
    fieldsToRemove.forEach((k)=>{
        delete n[k]
    })

    const user= await UserModel.findByIdAndUpdate(request.body.AuthorizedUser.id,
        n,
        {
        new:true,
        runValidators:true,
    }
    )
    if(!user){
        next(new ErrorResponse(404,`Resource ${request.body.AuthorizedUser.id} not found`))
    }
    response.status(200)
    response.send({success:true,data:user})    
})

export const updateImage= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    let image:String=request.body.image
 let resp= await cloudinary.v2.uploader.upload(image, 
  { public_id: `users/${request.body.AuthorizedUser.id}` },);

  if(resp.url){
    const user= await UserModel.findByIdAndUpdate(request.body.AuthorizedUser.id,
        {img:resp.url},
        {
        new:true,
        runValidators:true,
    }
    )
    if(!user){
        next(new ErrorResponse(404,`User ${request.body.AuthorizedUser.id} not found`))
    }
    response.status(200)
    response.send({success:true,data:user})
  }else{
   next(new ErrorResponse(505,`Failed to uplooad ${resp.reason}`))
  }

})