import {trendingtags} from '../controllers/feed'
import {Router} from 'express'
const router:Router=Router()

router.get('/tags',trendingtags)
export const trendRoute=router