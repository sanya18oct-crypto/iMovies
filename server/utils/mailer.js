const nodemailer=require('nodemailer');
let transport=null;
async function verifyTransport(){if(!process.env.EMAIL_HOST||!process.env.EMAIL_USER||!process.env.EMAIL_PASS){console.log('SMTP not configured; email notifications disabled');return false;}transport=nodemailer.createTransport({host:process.env.EMAIL_HOST,port:Number(process.env.EMAIL_PORT||587),secure:Number(process.env.EMAIL_PORT)===465,auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}});try{await transport.verify();console.log('SMTP transport verified');return true;}catch(e){console.error('SMTP verification failed:',e.message);transport=null;return false;}}
async function sendMail({to,subject,text,html}){if(!transport)return false;await transport.sendMail({from:process.env.EMAIL_FROM||process.env.EMAIL_USER,to,subject,text,html});return true;}
module.exports={verifyTransport,sendMail};
