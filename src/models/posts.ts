import mongoose,{Schema,Document} from 'mongoose'

export interface Post extends Document {
    author:String,
    title:String,
    image:String,
    contents:String,
    tags:String[],
    likes:Number,
    createdAt:Date,
  }

const PostSchema:Schema = new Schema({
    author:{required:true,type:String},
    title:{required:false,type:String},
    image:{required:false,type:String,default:''},
    contents:{required:true,type:String},
    tags:{required:false,type:[String]},
    likes:{required:false,type:Number,default:0},
    createdAt:{type:Date,default:Date.now}
})
PostSchema.pre('save',function(){

})
export const PostModel= mongoose.model('Post',PostSchema)