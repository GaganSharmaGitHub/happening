import mongoose,{Schema,Document} from 'mongoose'

const PostSchema:Schema = new Schema({
    author:{required:true,
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
    },
    title:{required:false,type:String},
    image:{required:false,type:String,},
    contents:{required:true,type:String},
    tags:{required:false,type:[String]},
    likes:{type:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],default:[],},
    createdAt:{type:Date,default:Date.now},
    public:{type:Boolean,default:true},
})
PostSchema.pre<any>('save',function(){
let extracted=`${this.contents}`.match(/#[\p{L}]+/ugi)
let tag= new Set(this.tags.concat(extracted))
this.tags=Array.from(tag)
})
export const PostModel= mongoose.model('Post',PostSchema)