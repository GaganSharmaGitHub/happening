"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var dotenv_1 = __importDefault(require("dotenv"));
var db = require("./configs/db");
var errors_1 = require("./middlewares/errors");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var fileUp = require('express-fileupload');
//import {seedData,clearData} from './test'
//load configs
dotenv_1.default.config({ path: './configs/config.env' });
//connect db
db.connectDB();
var app = express_1.default();
//routes
var posts_1 = require("./routes/posts");
var auth_1 = require("./routes/auth");
//middlewares
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(fileUp());
app.use(cookie_parser_1.default());
//import {clearData,seedData} from './test'
//clearData()
//seedData()
app.use('/api/v1/posts', posts_1.posts);
app.use('/api/v1/users', auth_1.userR);
var PORT = process.env.PORT || 4500;
//error handling
app.use(errors_1.errorHandler);
var server = app.listen(PORT, function () {
    console.log("Flying \u2708  \u2708  \u2708  on " + PORT);
});
//handle rejections
process.on('unhandledRejection', function (err, promise) {
    console.log("error!! \uD83D\uDE1E\uD83D\uDE1E " + err.name + ": " + err.message);
    //close and exit
    server.close(function () { return process.exit(1); });
});
