"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changepassword = exports.forgotPassword = exports.resetPassword = exports.login = exports.register = void 0;
var users_1 = require("../models/users");
var errorResponse_1 = require("../utils/errorResponse");
var async_1 = require("../middlewares/async");
var mailsender_1 = require("../utils/mailsender");
var bcryptjs_1 = require("bcryptjs");
//Register users
exports.register = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, name = _a.name, email = _a.email, password = _a.password;
                return [4 /*yield*/, users_1.UserModel.create({ name: name, email: email, password: password })];
            case 1:
                user = _b.sent();
                sendTokenResp(user, 200, response);
                return [2 /*return*/];
        }
    });
}); });
//login user
exports.login = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPwd;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(400, "enter email and password"))];
                }
                return [4 /*yield*/, users_1.UserModel.findOne({ email: email }).select('+password')];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(404, "user not found"))];
                }
                return [4 /*yield*/, user.matchPassword(password)
                    //create token
                ];
            case 2:
                isPwd = _b.sent();
                //create token
                if (!isPwd) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(401, "incorrect password"))];
                }
                sendTokenResp(user, 200, response);
                return [2 /*return*/];
        }
    });
}); });
exports.resetPassword = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, otp, newPass, user, isOTP, salt, password, newU;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = request.body.email;
                otp = request.body.otp;
                newPass = request.body.newPass;
                if (!email || !otp || !newPass) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(400, "enter email,otp and password"))];
                }
                return [4 /*yield*/, users_1.UserModel.findOne({ email: email }).select('+resetPasswordToken +resetExpire')];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(404, "user not found"))];
                }
                if (!user.resetPasswordToken || !user.resetExpire) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(404, "no otp sent yet"))];
                }
                return [4 /*yield*/, user.matchResetToken(otp, user.resetPasswordToken)
                    //create token
                ];
            case 2:
                isOTP = _a.sent();
                //create token
                if (!isOTP) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(401, "incorrect OTP"))];
                }
                if (user.resetExpire < Date.now()) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(401, "OTP expired"))];
                }
                return [4 /*yield*/, bcryptjs_1.genSalt(10)];
            case 3:
                salt = _a.sent();
                return [4 /*yield*/, bcryptjs_1.hash(newPass, salt)];
            case 4:
                password = _a.sent();
                return [4 /*yield*/, user.updateOne({ password: password, resetPasswordToken: undefined,
                        resetExpire: undefined }, { new: true })];
            case 5:
                newU = _a.sent();
                response.status(200).send({ success: true });
                return [2 /*return*/];
        }
    });
}); });
//one user
exports.forgotPassword = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, token, r, saving;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = request.body.email;
                if (!email) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(400, "enter email and password"))];
                }
                return [4 /*yield*/, users_1.UserModel.findOne({ email: email }).select('+password')];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(404, "user not found"))];
                }
                return [4 /*yield*/, user.getResetToken()];
            case 2:
                token = _a.sent();
                return [4 /*yield*/, mailsender_1.mailsender(user.email, "  " + token)];
            case 3:
                r = _a.sent();
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 4:
                saving = _a.sent();
                response.status(200).send({ data: r, success: true });
                return [2 /*return*/];
        }
    });
}); });
exports.changepassword = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, newPass, user, isPwd, salt, npassword, nuser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, password = _a.password, newPass = _a.newPass;
                if (!password || !newPass) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(400, "enter password"))];
                }
                return [4 /*yield*/, users_1.UserModel.findById(request.body.AuthorizedUser.id).select('+password')];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(404, "user not found"))];
                }
                return [4 /*yield*/, user.matchPassword(password)
                    //create token
                ];
            case 2:
                isPwd = _b.sent();
                //create token
                if (!isPwd) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(401, "incorrect password"))];
                }
                return [4 /*yield*/, bcryptjs_1.genSalt(10)];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, bcryptjs_1.hash(newPass, salt)];
            case 4:
                npassword = _b.sent();
                return [4 /*yield*/, users_1.UserModel.findByIdAndUpdate(request.body.AuthorizedUser.id, { password: npassword }, {
                        new: true,
                        runValidators: true,
                    })];
            case 5:
                nuser = _b.sent();
                response.status(200).send({ data: nuser, success: true });
                return [2 /*return*/];
        }
    });
}); });
var sendTokenResp = function (user, status, res) {
    var token = user === null || user === void 0 ? void 0 : user.getJSONWToken();
    var options = {
        expires: new Date(Date.now() +
            (parseInt("" + process.env.JWT_COOKIE_EXP) || 30) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    user.password = undefined;
    res.status(status).cookie('token', options).json({
        success: true,
        token: token,
        user: user
    });
};
