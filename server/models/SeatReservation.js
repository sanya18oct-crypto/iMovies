const mongoose=require('mongoose');
const schema=new mongoose.Schema({show:{type:mongoose.Schema.Types.ObjectId,ref:'Show',required:true},tier:{type:String,enum:['balcony','middle','lower'],required:true},row:{type:String,required:true},number:{type:Number,required:true},booking:{type:mongoose.Schema.Types.ObjectId,ref:'Booking',required:true},status:{type:String,enum:['pending','confirmed'],default:'pending'},expiresAt:{type:Date}},{timestamps:true});
schema.index({show:1,tier:1,row:1,number:1},{unique:true});schema.index({expiresAt:1},{expireAfterSeconds:0,sparse:true});
module.exports=mongoose.model('SeatReservation',schema);
