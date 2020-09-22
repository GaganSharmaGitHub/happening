import mongoose,{Schema,Document} from 'mongoose'
import {compare, genSalt, hash,} from 'bcryptjs'
import { sign as jsonWTSign} from 'jsonwebtoken'
import crypto from 'crypto'
const UserSchema:Schema = new Schema({
    name:{required:true,type:String},
    email:{
        required:[true,'enter email'],
        type:String,
        unique:true,
        match:[
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'invalid email',
        ]
    },
    password:{required:[true,'enter password'],type:String,minlength:6,select:false},
    createdAt:{type:Date,default:Date.now,},
    resetPasswordToken:{
        type:String,
        select:false,
    },
    resetExpire:Date,
    status:{default:'hey',required:false,type:String},
    about:{required:false,type:String},
    img:{required:false,type:String},
    followers:{type:[{type:mongoose.Schema.Types.ObjectId,ref:'User',}],default:[],},
    dob:{type:Date,required:false}
})
UserSchema.pre<any>('save', async function(next){
if(this.isModified('password')){
    console.log('password changed')
    const salt = await genSalt(10)
    this.password= await hash(this.password,salt)
}
    next()
})
UserSchema.methods.getJSONWToken=function(){
    return jsonWTSign(
        {
            id: this._id},
            `${process.env.JWT_SECRET}`,
            {expiresIn:`${process.env.JWT_EXP}`,}
            )
}
UserSchema.methods.matchPassword=async function(entered:string){
    return await compare(entered,this.password)
}

UserSchema.methods.matchResetToken=async function(entered:string,corr:string){
    return await compare(`${entered}`,corr)
}

UserSchema.methods.getResetToken=async function(){
const tok=crypto.randomBytes(5).toString('hex').slice(0, 4)
console.log(tok)
const salt = await genSalt(10)
this.resetPasswordToken= await hash(tok,salt)
//set expiry
this.resetExpire=Date.now()+10*60*60*1000
return tok
}
export const UserModel= mongoose.model('User',UserSchema)
