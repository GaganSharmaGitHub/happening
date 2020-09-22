"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userR = void 0;
var express_1 = require("express");
var auth_1 = require("../controllers/auth");
var user_1 = require("../controllers/user");
var feed_1 = require("../controllers/feed");
var auth_2 = require("../middlewares/auth");
var router = express_1.Router();
router.put('/update', auth_2.protect, user_1.updateUser);
// register
router.route('/register').post(auth_1.register);
router.route('/forgotpassword').put(auth_1.forgotPassword);
router.route('/resetpassword').put(auth_1.resetPassword);
router.route('/changepassword').put(auth_2.protect, auth_1.changepassword);
//login
router.route('/login').get(auth_1.login);
router.route('/myposts').get(auth_2.protect, feed_1.myPosts);
router.route('/myfeed').get(auth_2.protect, feed_1.myFeed);
router.route('/lookup/').get(user_1.lookup);
router.route('/:uid/').get(user_1.user);
router.route('/:id/follow').put(auth_2.protect, user_1.follow);
router.route('/:id/unfollow').put(auth_2.protect, user_1.unfollow);
exports.userR = router;
