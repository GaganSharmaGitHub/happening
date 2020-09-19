import {Router} from 'express'
import {register,login} from '../controllers/auth'
const router:Router=Router()
// register
router.route('/register').post(register)
//login
router.route('/login').get(login)
export const userR=router