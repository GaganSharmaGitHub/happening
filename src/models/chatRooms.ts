import mongoose,{Schema,Document} from 'mongoose'


const ChatRoomSchema:Schema = new Schema({
    
    members:{type:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
      }
    ],
        default:[],
        unique:true,
        required:true,
        
      },
      blockedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
      },
    createdAt:{type:Date,default:Date.now},
})

ChatRoomSchema.pre<any>('save',function(){
    if(this.isModified('members')){
        let extracted=this.members
        let memberset= new Set(extracted)
        this.tags=Array.from(memberset).sort()
      }
})
ChatRoomSchema.pre<any>('update',function(){
    if(this.isModified('members')){
        let extracted=this.members
        let memberset= new Set(extracted)
        this.tags=Array.from(memberset).sort()
      }
})
export const ChatModel= mongoose.model('ChatRoom',ChatRoomSchema)