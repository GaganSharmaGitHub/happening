import {Router} from 'express'
import {deleteMessage,getMessages} from '../controllers/messages'
import {protect} from '../middlewares/auth'
const router:Router=Router()
//all posts
router.route('/').get(protect,getMessages)

//delete one post
router.delete('/:id',protect,deleteMessage,)
export const messageRouter=router