export const asyncHandler=(f:any)=>(req:any,res:any,next:any,)=>{
Promise.resolve(f(req,res,next,)).catch(next)
}