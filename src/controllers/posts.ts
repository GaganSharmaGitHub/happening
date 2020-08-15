import express,{Request,Response,Router,NextFunction} from 'express'
import {Post,PostModel} from '../models/posts'
//get all posts
export const getPosts= async (request: Request,response: Response,next:NextFunction)=>{
   try {
    const posts= await PostModel.find()

    response.status(200)
    response.send({success:true,count:posts.length,data:posts})   
   } catch (error) {
    response.status(400).json({succes:false,reason:error})
   }
}
//create a post
export const makePosts= async (request: Request,response: Response,next:NextFunction)=>{
    try {
     
 const post= await PostModel.create(request.body)
 response.status(201).json({success: true,data:post})   
    } catch (error) {
        response.status(400).json({succes:false,reason:error})
    }
}
//get one post
export const getPost= async (request: Request,response: Response,next:NextFunction)=>{
    try {
        const post= await PostModel.findById(request.params.id)
        if(!post){
        response.status(400).json({succes:false,reason:'not found'})
        return ;
        }
        response.status(200)
        response.send({success:true,data:post})   
       } catch (error) {
        response.status(400).json({succes:false,reason:error.reason})
       }
}
//delete one post
export const deletePost=async(request: Request,response: Response,next:NextFunction)=>{
    try {
        const post= await PostModel.findByIdAndDelete(request.params.id,)
        if(!post){
        response.status(400).json({succes:false,reason:'not found'})
        return ;
        }
        response.status(200)
        response.send({success:true,data:{}})   
       } catch (error) {
        response.status(400).json({succes:false,reason:error.reason})
       }
 }
//update post

export const updatePost=async (request: Request,response: Response,next:NextFunction)=>{
    try {
        const post= await PostModel.findByIdAndUpdate(request.params.id,request.body,{
            new:true,
            runValidators:true,
        }
        )
        if(!post){
        response.status(400).json({succes:false,reason:'not found'})
        return ;
        }
        response.status(200)
        response.send({success:true,data:post})   
       } catch (error) {
        response.status(400).json({succes:false,reason:error.reason})
       }
 
}