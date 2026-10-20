const Favorite=require('../models/Favorite');const Movie=require('../models/Movie');
async function list(req,res){const items=await Favorite.find({user:req.user.id}).populate('movie').sort({createdAt:-1});res.json({success:true,items:items.map(x=>({id:x._id,movie:x.movie}))});}
async function add(req,res){if(!await Movie.exists({_id:req.body.movieId}))return res.status(404).json({success:false,message:'Movie not found'});const item=await Favorite.findOneAndUpdate({user:req.user.id,movie:req.body.movieId},{user:req.user.id,movie:req.body.movieId},{upsert:true,new:true,setDefaultsOnInsert:true});res.status(201).json({success:true,item});}
async function remove(req,res){await Favorite.findOneAndDelete({user:req.user.id,movie:req.params.movieId});res.json({success:true,message:'Removed from favourites'});}
module.exports={list,add,remove};
