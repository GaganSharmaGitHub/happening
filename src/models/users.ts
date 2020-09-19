import mongoose,{Schema,Document} from 'mongoose'
import {compare, genSalt, hash,} from 'bcryptjs'
import { sign as jsonWTSign} from 'jsonwebtoken'
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
})
UserSchema.pre<any>('save', async function(next){
    const salt = await genSalt(10)
    this.password= await hash(this.password,salt)

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
export const UserModel= mongoose.model('User',UserSchema)
