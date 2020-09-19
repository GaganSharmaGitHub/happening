import {Router} from 'express'
import {getPost,getPosts,deletePost,makePosts,updatePost,imageUploadPost} from '../controllers/posts'
import {protect} from '../middlewares/auth'
const router:Router=Router()
//all posts
router.route('/').get(getPosts).post(protect,makePosts)
//get one post
router.get('/:id',getPost)
//upload an image 
router.put('/:id/uploadImage',protect,imageUploadPost)
//edit post
router.put('/:id',protect,updatePost,)
//delete one post
router.delete('/:id',protect,deletePost,)
export const posts=router