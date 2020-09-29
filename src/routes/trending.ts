import {trendingtags,trendingposts} from '../controllers/feed'
import {Router} from 'express'
const router:Router=Router()

router.get('/tags',trendingtags)
router.get('/posts',trendingposts)
export const trendRoute=router