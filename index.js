const express= require('express');
const env=require('dotenv');
//load configs
env.config({path:'./configs/config.env'})
const app= express();
const PORT= process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})