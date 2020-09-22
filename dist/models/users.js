"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var crypto_1 = __importDefault(require("crypto"));
var UserSchema = new mongoose_1.Schema({
    name: { required: true, type: String },
    email: {
        required: [true, 'enter email'],
        type: String,
        unique: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'invalid email',
        ]
    },
    password: { required: [true, 'enter password'], type: String, minlength: 6, select: false },
    createdAt: { type: Date, default: Date.now, },
    resetPasswordToken: {
        type: String,
        select: false,
    },
    resetExpire: Date,
    status: { default: 'hey', required: false, type: String },
    about: { required: false, type: String },
    img: { required: false, type: String },
    followers: { type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', }], default: [], },
    dob: { type: Date, required: false }
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!this.isModified('password')) return [3 /*break*/, 3];
                    console.log('password changed');
                    return [4 /*yield*/, bcryptjs_1.genSalt(10)];
                case 1:
                    salt = _b.sent();
                    _a = this;
                    return [4 /*yield*/, bcryptjs_1.hash(this.password, salt)];
                case 2:
                    _a.password = _b.sent();
                    _b.label = 3;
                case 3:
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
UserSchema.methods.getJSONWToken = function () {
    return jsonwebtoken_1.sign({
        id: this._id
    }, "" + process.env.JWT_SECRET, { expiresIn: "" + process.env.JWT_EXP, });
};
UserSchema.methods.matchPassword = function (entered) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcryptjs_1.compare(entered, this.password)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
UserSchema.methods.matchResetToken = function (entered, corr) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcryptjs_1.compare("" + entered, corr)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
UserSchema.methods.getResetToken = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tok, salt, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tok = crypto_1.default.randomBytes(5).toString('hex').slice(0, 4);
                    console.log(tok);
                    return [4 /*yield*/, bcryptjs_1.genSalt(10)];
                case 1:
                    salt = _b.sent();
                    _a = this;
                    return [4 /*yield*/, bcryptjs_1.hash(tok, salt)
                        //set expiry
                    ];
                case 2:
                    _a.resetPasswordToken = _b.sent();
                    //set expiry
                    this.resetExpire = Date.now() + 10 * 60 * 60 * 1000;
                    return [2 /*return*/, tok];
            }
        });
    });
};
exports.UserModel = mongoose_1.default.model('User', UserSchema);
