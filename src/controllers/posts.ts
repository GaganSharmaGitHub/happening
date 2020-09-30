import {Request,Response,NextFunction} from 'express'
import {PostModel} from '../models/posts'
import {ErrorResponse} from '../utils/errorResponse'
import {asyncHandler} from '../middlewares/async'
const cloudinary=require('cloudinary')
const populatePost=(k:any)=>k.populate('likes').populate('author').populate({
    path: 'repost',
    populate: { path: 'author' }
  })
//get all posts
export const getPosts= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    let reqQu={...request.query}
    const fieldsToRemove:string[]=['select','sort','page','limit',]
    fieldsToRemove.forEach((k)=>{
        delete reqQu[k]
    })
    reqQu.public='true';
    console.log(reqQu)
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
     query=populatePost(query)
     //pagination
     let pagination:any={};     
     const page:number= parseInt(`${request.query.page}`)||1
     const limit:number= parseInt(`${request.query.limit}`)||50
     const skip:number=(page-1)*limit
     const totalDocs:number= await PostModel.countDocuments()
     query.skip(skip).limit(limit)
     pagination.totalPages=Math.ceil(totalDocs/limit)
     pagination.nextPage= skip<totalDocs? {page:page+1,limit}:undefined
     pagination.previousPage= skip>0? {page:page-1,limit}:undefined
     pagination.currentPage= skip>0? {page,limit}:undefined

     //execute
    const posts= await query
    console.log(posts.length)
    response.status(200)
    response.send({success:true,count:posts.length,data:posts,pages:pagination})
})

//create a post
export const makePosts= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{     
    request.body.author=request.body.AuthorizedUser.id
   let {author,tags,title,contents,repost}=request.body
   let image:any=request.body.image
   tags=tags?tags:[]
   if(image){
   let resp= await cloudinary.v2.uploader.upload(image, 
    { folder: `posts` },);
    if(resp.url){
        image=resp.url;
    }else{
     image=undefined;
    }
   }
  
    const data= await PostModel.create({author,tags,title,contents,likes:[],image,repost})
    
    response.status(201).json({success: true,data})   
   })

export const likePost= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
  //  console.log(request.params.id)
    const post= await PostModel.findByIdAndUpdate(request.params.id,{
        $addToSet:{likes:request.body.AuthorizedUser.id}
    },
    {
        new:true,
    }
    )
    response.status(200)
    response.send({success:true,data:post}
        )    
})

export const unlikePost= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
      const post= await PostModel.findByIdAndUpdate(request.params.id,{
          $pull:{likes:request.body.AuthorizedUser.id}
      },
      {
          new:true,
      }
      )
      response.status(200)
      response.send({success:true,data:post}
          )    
  })
//get one post
export const getPost= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    const post= await populatePost(PostModel.findById(request.params.id))
    if(!post || !post.toObject().public){
        next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
    response.status(200)
    response.send({success:true,data:post,})        
})
//delete one post
export const deletePost= asyncHandler(async(request: Request,response: Response,next:NextFunction)=>{
    const post= await PostModel.findByIdAndDelete(request.params.id,)
    
    if(!post){
        next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
    response.status(200)
    response.send({success:true,data:{}})   
})
//update post
export const updatePost= asyncHandler(async (request: Request,response: Response,next:NextFunction)=>{
    request.body.author=request.body.AuthorizedUser.id
    const post= await PostModel.findByIdAndUpdate(request.params.id,request.body,{
        new:true,
        runValidators:true,
    }
    )
    if(!post){
        next(new ErrorResponse(404,`Resource ${request.params.id} not found`))
    }
    response.status(200)
    response.send({success:true,data:post})    
})