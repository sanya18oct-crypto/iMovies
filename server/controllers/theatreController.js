const Theatre=require('../models/Theatre');const {z}=require('zod');
const tier=z.object({rows:z.coerce.number().int().min(1).max(20),seatsPerRow:z.coerce.number().int().min(1).max(30)});
const schema=z.object({theatreName:z.string().trim().min(2).max(120),location:z.string().trim().min(2).max(200),balconySeatPrice:z.coerce.number().min(0),middleSeatPrice:z.coerce.number().min(0),lowerSeatPrice:z.coerce.number().min(0),balconySeats:tier,middleSeats:tier,lowerSeats:tier});
async function list(req,res){const filter={isActive:true};if(req.query.location)filter.location=new RegExp(String(req.query.location).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i');res.json({success:true,items:await Theatre.find(filter).sort({theatreName:1})});}
async function create(req,res){const item=await Theatre.create({...schema.parse(req.body),adminName:req.user.username});res.status(201).json({success:true,item});}
async function update(req,res){const item=await Theatre.findByIdAndUpdate(req.params.id,schema.partial().parse(req.body),{new:true,runValidators:true});if(!item)return res.status(404).json({success:false,message:'Theatre not found'});res.json({success:true,item});}
async function remove(req,res){const item=await Theatre.findByIdAndUpdate(req.params.id,{isActive:false},{new:true});if(!item)return res.status(404).json({success:false,message:'Theatre not found'});res.json({success:true,message:'Theatre deactivated'});}
module.exports={list,create,update,remove};
