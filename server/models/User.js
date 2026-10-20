const mongoose = require('mongoose');
const schema = new mongoose.Schema({ username:{type:String,required:true,trim:true,minlength:3,maxlength:20}, email:{type:String,required:true,unique:true,lowercase:true,trim:true,maxlength:254}, password:{type:String,required:true,select:false,minlength:8}, role:{type:String,enum:['user','admin'],default:'user'}, phone:{type:String,trim:true}, isActive:{type:Boolean,default:true} }, {timestamps:true});
schema.index({username:1});
module.exports = mongoose.model('User',schema);
