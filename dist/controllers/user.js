"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.updateUser = exports.unfollow = exports.follow = exports.lookup = exports.user = void 0;
var users_1 = require("../models/users");
var errorResponse_1 = require("../utils/errorResponse");
var async_1 = require("../middlewares/async");
exports.user = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, users_1.UserModel.findById(request.params.uid)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.ErrorResponse(404, "user not found"))];
                }
                response.send({ success: true, data: user });
                return [2 /*return*/];
        }
    });
}); });
exports.lookup = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqQu, fieldsToRemove, query, field, field, sorts, pagination, page, limit, skip, users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqQu = __assign({}, request.query);
                fieldsToRemove = ['select', 'sort', 'page', 'limit',];
                fieldsToRemove.forEach(function (k) {
                    delete reqQu[k];
                });
                console.log(reqQu);
                query = users_1.UserModel.find(reqQu);
                if (request.query.select) {
                    field = ("" + request.query.select).split(',').join(' ');
                    query = query.select(field);
                }
                //select fields
                if (request.query.select) {
                    field = ("" + request.query.select).split(',').join(' ');
                    query = query.select(field);
                }
                //sort
                if (request.query.sort) {
                    sorts = ("" + request.query.sort).split(',').join(' ');
                    query = query.sort(sorts);
                }
                else {
                    query = query.sort('-createdAt');
                }
                pagination = {};
                page = parseInt("" + request.query.page) || 1;
                limit = parseInt("" + request.query.limit) || 50;
                skip = (page - 1) * limit;
                query.skip(skip).limit(limit);
                pagination.nextPage = { page: page + 1, limit: limit };
                pagination.previousPage = skip > 0 ? { page: page - 1, limit: limit } : undefined;
                pagination.currentPage = skip > 0 ? { page: page, limit: limit } : undefined;
                return [4 /*yield*/, query];
            case 1:
                users = _a.sent();
                console.log(users.length);
                response.status(200);
                response.send({ success: true, count: users.length, data: users, pages: pagination });
                return [2 /*return*/];
        }
    });
}); });
exports.follow = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, users_1.UserModel.findByIdAndUpdate(request.body.AuthorizedUser.id, {
                    $push: { followers: request.params.id }
                }, {
                    new: true,
                })];
            case 1:
                post = _a.sent();
                response.status(200);
                response.send({ success: true, data: post });
                return [2 /*return*/];
        }
    });
}); });
exports.unfollow = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, users_1.UserModel.findByIdAndUpdate(request.body.AuthorizedUser.id, {
                    $pull: { followers: request.params.id }
                }, {
                    new: true,
                })];
            case 1:
                post = _a.sent();
                response.status(200);
                response.send({ success: true, data: post });
                return [2 /*return*/];
        }
    });
}); });
exports.updateUser = async_1.asyncHandler(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var n, fieldsToRemove, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                n = __assign({}, request.body);
                fieldsToRemove = ['email', 'password', 'createdAt', 'resetPasswordToken', 'resetExpire', 'followers'];
                fieldsToRemove.forEach(function (k) {
                    delete n[k];
                });
                return [4 /*yield*/, users_1.UserModel.findByIdAndUpdate(request.body.AuthorizedUser.id, n, {
                        new: true,
                        runValidators: true,
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    next(new errorResponse_1.ErrorResponse(404, "Resource " + request.body.AuthorizedUser.id + " not found"));
                }
                response.status(200);
                response.send({ success: true, data: user });
                return [2 /*return*/];
        }
    });
}); });
