//seeeder
import {PostModel} from './models/posts'
 const d=require('../sample/sample.json')
console.log(d.length)

export const seedData= async()=>{
    try{
        await PostModel.create(d)
        console.log('imported')
        process.exit()
    }catch(e){
        console.log(e)
    }
}
export const clearData= async()=>{
    try{
        await PostModel.deleteMany(()=>{})
        console.log('deleted')
        process.exit()
    }catch(e){
        console.log(e)
    }
}