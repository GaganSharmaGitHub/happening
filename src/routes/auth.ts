import {Router} from 'express'
import {register,login,forgotPassword} from '../controllers/auth'
import {follow,unfollow,user,lookup,updateUser} from '../controllers/user'
import {myFeed,myPosts} from '../controllers/feed'
import {protect} from '../middlewares/auth'

const router:Router=Router()
router.put('/update',protect,updateUser)
// register
router.route('/register').post(register)
router.route('/forgotpassword').put(forgotPassword)
//login
router.route('/login').get(login)
router.route('/myposts').get(protect,myPosts)
router.route('/myfeed').get(protect,myFeed)
router.route('/lookup/').get(lookup)
router.route('/:uid/').get(user)
router.route('/:id/follow').put(protect,follow)
router.route('/:id/unfollow').put(protect,unfollow)

export const userR=router