import mongoose = require("mongoose");
export const connectDB= async ()=>{
    const uri=process.env.MONGO_URI

    try{
    const connection= await mongoose.connect(`${uri}`,
    {
       useNewUrlParser:true,
       useCreateIndex:true,
       useFindAndModify:false,
       useUnifiedTopology:true
   
   }
    );
    console.log(`db connected at ${connection.connection.host}`)
   
}catch(e){
    console.log(`failed to connect to ${uri} because oh no ${e}`)
}
}