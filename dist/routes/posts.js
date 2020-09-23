"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posts = void 0;
var express_1 = require("express");
var posts_1 = require("../controllers/posts");
var auth_1 = require("../middlewares/auth");
var router = express_1.Router();
//all posts
router.route('/').get(posts_1.getPosts).post(auth_1.protect, posts_1.makePosts);
//get one post
router.get('/:id', posts_1.getPost);
//like post
router.put('/:id/like', auth_1.protect, posts_1.likePost);
//like post
router.put('/:id/unlike', auth_1.protect, posts_1.unlikePost);
//upload an image 
router.put('/:id/uploadImage', auth_1.protect, posts_1.imageUploadPost);
//edit post
router.put('/:id', auth_1.protect, posts_1.updatePost);
//delete one post
router.delete('/:id', auth_1.protect, posts_1.deletePost);
exports.posts = router;
