import {Router} from 'express'
import {protect} from '../middlewares/auth'
import {block,createRoom,deleteChat,myChatRooms,unblock,getRoom,addToRoom,joinRoom,leaveRoom} from '../controllers/chatRoom'
const router:Router=Router()
//all posts
router.post('/',protect,createRoom)
router.route('/mychatrooms').get(protect,myChatRooms)
//get one room
router.get('/:id',protect,getRoom)
//delete one room
router.delete('/:id',protect,deleteChat,)
router.put('/:id/add',protect, addToRoom)
router.put('/:id/join',protect, joinRoom)
router.put('/:id/leave',protect, leaveRoom)
router.put('/:id/block',protect, block)
router.put('/:id/unblock',protect, unblock)
export const chatroom=router
