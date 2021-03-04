import mongoose,{Schema,Document} from 'mongoose'


const MessageSchema:Schema = new Schema({
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ChatRoom',
    },
    type:{
    type:String,
    default:'text',
    },
    
   content:{
        type:String,
        default:'',
        },
    from:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    createdAt:{type:Date,default:Date.now},
})

MessageSchema.pre<any>('save',function(){
    if(this.isModified('members')){
        let extracted=this.members
        let memberset= new Set(extracted)
        this.tags=Array.from(memberset).sort()
      }
})
MessageSchema.pre<any>('update',function(){
    if(this.isModified('members')){
        let extracted=this.members
        let memberset= new Set(extracted)
        this.tags=Array.from(memberset).sort()
      }
})
export const MessageModel= mongoose.model('Message',MessageSchema)