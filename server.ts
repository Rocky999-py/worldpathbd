
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Request threshold reached.' }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/worldpath_bd';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ WorldPath DB Active'))
  .catch((err) => console.error('❌ DB Fault:', err));

// Models
const WalletSchema = new mongoose.Schema({
  walletId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const InquirySchema = new mongoose.Schema({
  walletId: String,
  name: String,
  phone: String,
  portal: String,
  country: String,
  plan: String,
  status: { type: String, default: 'Pending' },
  timestamp: { type: Date, default: Date.now }
});

const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

// --- API ROUTES ---

// SSLCommerz Initialization Simulation
app.post('/api/payment/init', apiLimiter, async (req, res) => {
  const { walletId, amount, method } = req.body;
  
  // In real SSLCommerz:
  // 1. Create unique transaction ID
  // 2. Build SSLCommerz request object
  // 3. Call SSLCommerz API
  // 4. Return GatewayPageURL
  
  res.json({
    status: 'SUCCESS',
    GatewayPageURL: `https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?id=${Math.random().toString(36).substr(2, 5)}`
  });
});

// Payment Hooks (Success/Fail/Cancel)
app.post('/api/payment/success', async (req, res) => {
  const { tran_id, walletId, amount } = req.body;
  // Update wallet balance in DB
  await Wallet.findOneAndUpdate(
    { walletId },
    { $inc: { balance: amount }, lastUpdated: new Date() },
    { upsert: true }
  );
  res.redirect(`${process.env.FRONTEND_URL}/#/add-fund?status=success`);
});

// Public Feed
app.get('/api/public/recent-inquiries', async (req, res) => {
  const inquiries = await Inquiry.find().sort({ timestamp: -1 }).limit(10);
  res.json(inquiries);
});

// Service Inquiry
app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ error: 'Fault' });
  }
});

// Serve Static
const DIST_PATH = path.join(__dirname, 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(DIST_PATH));
  app.get('*', (req, res) => res.sendFile(path.join(DIST_PATH, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Gateway Node on port ${PORT}`));
