import {Router} from 'express'
import {protect} from '../middlewares/auth'
import {block,createRoom,deleteChat,myChatRooms,unblock,getRoom} from '../controllers/chatRoom'
const router:Router=Router()
//all posts
router.post('/',protect,createRoom)
router.route('/mychatrooms').get(protect,myChatRooms)
router.put('/:id/block',protect, block)
router.put('/:id/unblock',protect, unblock)
//get one room
router.get('/:id',protect,getRoom)
//delete one room
router.delete('/:id',protect,deleteChat,)
export const chatroom=router