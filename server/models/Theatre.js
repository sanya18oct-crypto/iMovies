const mongoose=require('mongoose');
const tierSchema=new mongoose.Schema({rows:{type:Number,default:3,min:1,max:20},seatsPerRow:{type:Number,default:10,min:1,max:30}},{_id:false});
const schema=new mongoose.Schema({theatreName:{type:String,required:true,trim:true},location:{type:String,required:true,trim:true,index:true},adminName:String,balconySeatPrice:{type:Number,required:true,min:0},middleSeatPrice:{type:Number,required:true,min:0},lowerSeatPrice:{type:Number,required:true,min:0},balconySeats:{type:tierSchema,default:()=>({})},middleSeats:{type:tierSchema,default:()=>({})},lowerSeats:{type:tierSchema,default:()=>({})},isActive:{type:Boolean,default:true}},{timestamps:true});
module.exports=mongoose.model('Theatre',schema);
