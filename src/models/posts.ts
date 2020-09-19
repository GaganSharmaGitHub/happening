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
    image:{required:false,type:String,},
    contents:{required:true,type:String},
    tags:{required:false,type:[String]},
    likes:{type:[mongoose.SchemaTypes.ObjectId],default:[]},
    createdAt:{type:Date,default:Date.now},
    public:{type:Boolean,default:true}
})
PostSchema.pre('save',function(){

})
export const PostModel= mongoose.model('Post',PostSchema)