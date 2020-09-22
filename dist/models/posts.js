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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var PostSchema = new mongoose_1.Schema({
    author: { required: true,
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: { required: false, type: String },
    image: { required: false, type: String, },
    contents: { required: true, type: String },
    tags: { required: false, type: [String] },
    likes: { type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        default: [],
        unique: false,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    public: { type: Boolean, default: true },
});
PostSchema.pre('save', function () {
    if (this.isModified('contents') || this.isModified('tags')) {
        var extracted = ("" + this.contents).match(/#[\p{L}]+/ugi);
        var tag = new Set(this.tags.concat(extracted));
        console.log(tag);
        this.tags = Array.from(tag);
    }
    if (this.isModified('likes')) {
        console.log(this.likes);
        var l = new Set(this.likes);
        this.likes = Array.from(l);
    }
});
exports.PostModel = mongoose_1.default.model('Post', PostSchema);
