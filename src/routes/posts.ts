import express,{Application,Request,Response,Router} from 'express'
import {getPost,getPosts,deletePost,makePosts,updatePost} from '../controllers/posts'
const router:Router=Router()
//all posts
router.route('/').get(getPosts).post(makePosts)
//get one post
router.get('/:id',getPost)
//edit post
router.put('/:id',updatePost,)
//delete one post
router.delete('/:id',deletePost,)
export const posts=router