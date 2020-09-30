import {Router} from 'express'
import {getPost,getPosts,deletePost,makePosts,
    updatePost,likePost,unlikePost} from '../controllers/posts'
import {protect} from '../middlewares/auth'
const router:Router=Router()
//all posts
router.route('/').get(getPosts).post(protect,makePosts)
//get one post
router.get('/:id',getPost)
//like post
router.put('/:id/like',protect,likePost)
//like post
router.put('/:id/unlike',protect,unlikePost)
//edit post
router.put('/:id',protect,updatePost,)
//delete one post
router.delete('/:id',protect,deletePost,)
export const posts=router