const Booking=require('../models/Booking');const SeatReservation=require('../models/SeatReservation');
async function cleanupOldBookings(){const now=new Date();const expired=await Booking.find({status:'pending',expiresAt:{$lte:now}}).select('_id');const ids=expired.map(x=>x._id);const result=await Booking.updateMany({_id:{$in:ids}},{$set:{status:'payment_failed',paymentStatus:'failed'}});if(ids.length)await SeatReservation.deleteMany({booking:{$in:ids},status:'pending'});return result.modifiedCount;}
module.exports={cleanupOldBookings};
