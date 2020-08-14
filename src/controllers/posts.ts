import express,{Request,Response,Router,NextFunction} from 'express'
import {Post,PostModel} from '../models/posts'
//get all posts
export const getPosts=(request: Request,response: Response,next:NextFunction)=>{
    response.status(200)
    response.send({success:true,data:'all posts'})
}
//create a post
export const makePosts=(request: Request,response: Response,next:NextFunction)=>{
    console.log(request.body)
    response.status(200)
    response.send({success:true,data:'created a post'})
}
//get one post
export const getPost=(request: Request,response: Response,next:NextFunction)=>{
    response.status(200)
    response.send({success:true,data:'get post no :'+request.params.id})
}
//delete one post
export const deletePost=(request: Request,response: Response,next:NextFunction)=>{
    response.status(200)
    response.send({success:true,data:'delete post no :'+request.params.id})
}
//update post

export const updatePost=(request: Request,response: Response,next:NextFunction)=>{
    response.status(200)
    response.send({success:true,data:'updates post no :'+request.params.id})
}