import {Router} from 'express'
import {register,login,forgotPassword,resetPassword,changepassword} from '../controllers/auth'
import {follow,unfollow,user,lookup,updateUser,updateImage,basicinfo} from '../controllers/user'
import {myFeed,myPosts} from '../controllers/feed'
import {protect} from '../middlewares/auth'

const router:Router=Router()
router.put('/update',protect,updateUser)
router.put('/uploadImage',protect,updateImage)
// register
router.route('/register').post(register)
router.route('/forgotpassword').put(forgotPassword)
router.route('/resetpassword').put(resetPassword)
router.route('/changepassword').put(protect,changepassword)
//login
router.route('/login').put(login)
//feed
router.route('/myposts').get(protect,myPosts)
router.route('/myfeed').get(protect,myFeed)
///user crud
router.route('/lookup/').get(lookup)
router.route('/:uid/').get(user)
router.route('/:uid/basicinfo').get(basicinfo)
router.route('/:id/follow').put(protect,follow)
router.route('/:id/unfollow').put(protect,unfollow)

export const userR=router