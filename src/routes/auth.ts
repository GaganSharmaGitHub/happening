import {Router} from 'express'
import {register,login,} from '../controllers/auth'
import {follow,unfollow,myPosts,user} from '../controllers/user'
import {protect} from '../middlewares/auth'

const router:Router=Router()
// register
router.route('/register').post(register)
//login
router.route('/login').get(login)
router.route('/myposts').get(protect,myPosts)
router.route('/:uid/posts').get(protect,myPosts)
router.route('/:uid/').get(user)
router.route('/:uid/follow').get(protect,follow)
router.route('/:uid/unfollow').get(protect,unfollow)

export const userR=router