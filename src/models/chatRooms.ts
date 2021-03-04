import mongoose,{Schema,Document} from 'mongoose'


const ChatRoomSchema:Schema = new Schema({
    
  members:{type:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
      }
    ],
        default:[],
        required:true,        
      },
  title:{
    type:String,
    default:'Chat'
    },
    author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
    },
  blockedBy:{
    type:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
    }
  ],
      default:[],
      required:true,        
    },
    createdAt:{type:Date,default:Date.now},
})

ChatRoomSchema.pre<any>('save',function(){
    if(this.isModified('members')){
        let extracted=this.members
        let memberset= new Set(extracted)
        console.log(extracted)
        this.members=Array.from(memberset).sort()
      }
      if(this.isModified('blockedBy')){
        let extracted=this.blockedBy
        let blockedByset= new Set(extracted)
        this.blockedBy=Array.from(blockedByset).sort()
      }
})
ChatRoomSchema.pre<any>('update',function(){
    if(this.isModified('members')){
        let extracted=this.members
        let memberset= new Set(extracted)
        console.log(extracted)

        this.members=Array.from(memberset).sort()
      }
      if(this.isModified('blockedBy')){
        let extracted=this.blockedBy
        let blockedByset= new Set(extracted)
        this.blockedBy=Array.from(blockedByset).sort()
      }
})
export const ChatModel= mongoose.model('ChatRoom',ChatRoomSchema)