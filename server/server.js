require('dotenv').config();
const dns = require('node:dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const { cleanupOldBookings } = require('./utils/cleanupService');
const { sendReminderEmails } = require('./utils/reminderService');
const { verifyTransport } = require('./utils/mailer');
const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
const configuredOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(origin => {
      const value = origin.trim();
      return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
    })
  : [];
if (process.env.NODE_ENV !== 'production') configuredOrigins.push('http://localhost:5173');
app.use(cors({ origin: configuredOrigins.length ? configuredOrigins : 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/health', (_req, res) => res.json({ success: true, service: 'imovies-api', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
for (const [path, file] of Object.entries({ '/api/auth':'authRoutes', '/api/movie':'movieRoutes', '/api/theatre':'theatreRoutes', '/api/shows':'showRoutes', '/api/bookings':'bookingRoutes', '/api/favorite':'favoriteRoutes', '/api/review':'reviewRoutes', '/api/payments':'paymentRoutes', '/api/admin':'adminRoutes' })) app.use(path, require(`./routes/${file}`));
app.use((req, res) => res.status(404).json({ success:false, message:`Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'ZodError') return res.status(400).json({ success:false, message:err.issues?.map(i=>`${i.path.join('.')||'input'}: ${i.message}`).join('; ') || 'Invalid request data' });
  if (err.name === 'ValidationError') return res.status(400).json({ success:false, message:err.message });
  if (err.name === 'CastError') return res.status(400).json({ success:false, message:'Invalid resource ID' });
  if (err.code === 11000) return res.status(409).json({ success:false, message:'A record with this value already exists' });
  res.status(err.status || 500).json({ success:false, message: err.status && err.status < 500 ? err.message : 'An unexpected server error occurred' });
});
async function start() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await verifyTransport();
  cron.schedule('*/15 * * * *', () => cleanupOldBookings().catch(console.error));
  cron.schedule('0 * * * *', () => sendReminderEmails().catch(console.error));
  const server = app.listen(process.env.PORT || 3000, () => console.log(`IMovies API listening on ${process.env.PORT || 3000}`));
  const shutdown = async () => { server.close(); await mongoose.disconnect(); process.exit(0); };
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
}
if (require.main === module) start().catch(err => { console.error('Startup failed:', err.message); process.exit(1); });
module.exports = app;
