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
    likes:{type:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
      }
    ],
        default:[],
        unique:false,
        required:true
      },
    createdAt:{type:Date,default:Date.now},
    public:{type:Boolean,default:true},
})
PostSchema.pre<any>('save',function(){
  if(this.isModified('contents')||this.isModified('tags')){
    let extracted=`${this.contents}`.match(/#[\p{L}]+/ugi)
    let tag= new Set(this.tags.concat(extracted))
    console.log(tag)
    this.tags=Array.from(tag)
  }
  if(this.isModified('likes')){
  console.log(this.likes)
 let l= new Set(this.likes)
    
 this.likes=Array.from(l)
  }
  
})
export const PostModel= mongoose.model('Post',PostSchema)