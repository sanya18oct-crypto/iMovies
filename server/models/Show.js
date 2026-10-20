const mongoose=require('mongoose');
const schema=new mongoose.Schema({movie:{type:mongoose.Schema.Types.ObjectId,ref:'Movie',required:true,index:true},theatre:{type:mongoose.Schema.Types.ObjectId,ref:'Theatre',required:true,index:true},showdate:{type:String,required:true,match:/^\d{4}-\d{2}-\d{2}$/},showtime:{type:String,required:true,match:/^(?:[01]\d|2[0-3]):[0-5]\d$/},createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},status:{type:String,enum:['scheduled','cancelled','completed'],default:'scheduled'},seatLayout:{type:mongoose.Schema.Types.Mixed,default:{} }},{timestamps:true});
schema.index({movie:1,showdate:1,showtime:1}); schema.index({theatre:1,showdate:1,showtime:1});
module.exports=mongoose.model('Show',schema);
