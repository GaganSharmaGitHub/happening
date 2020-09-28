import {Request,Response,NextFunction} from 'express'
import {PostModel} from '../models/posts'
import {UserModel} from '../models/users'
import {ErrorResponse} from '../utils/errorResponse'
import {asyncHandler} from '../middlewares/async'

  
export const myFeed= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    //find user
        const user:any= await UserModel.findById(request.body.AuthorizedUser.id).populate('followers')
        if(!user){
        return next(new ErrorResponse(404,`user not found`))
        }
        const followers:any=user.followers
        if(!followers||!Array.isArray(followers)|| !followers.length){
            response.send({success:true,data:user,posts:{length:0,data:[]}})
        }
        let reqQu={...request.query}
        const fieldsToRemove:string[]=['select','sort','page','limit',]
        fieldsToRemove.forEach((k)=>{
            delete reqQu[k]
        })
         reqQu.$or=followers.map((k:any)=>{return {author:k._id}})
        //query
        let query=PostModel.find(reqQu).populate('author')
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
         let pagination:any={};     
         const page:number= parseInt(`${request.query.page}`)||1
         const limit:number= parseInt(`${request.query.limit}`)||50
         const skip:number=(page-1)*limit
         query.skip(skip).limit(limit)
         pagination.nextPage= {page:page+1,limit}
         pagination.previousPage= skip>0? {page:page-1,limit}:undefined
         pagination.currentPage= skip>0? {page,limit}:undefined
    
        const posts= await query
        console.log(posts.length)
        response.status(200)
        response.send({success:true,user,posts:{data:posts,count:posts.length,pagination}})
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

export const trendingtags= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    //query
    let query=PostModel.aggregate([ { $unwind: "$tags" },  { $sortByCount: "$tags" } ])   //execute
    const tags= await query
    console.log(tags.length)
    response.status(200)
    response.send({success:true,count:tags.length,tags})
})