
import express from 'express';
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
  name: String,
  phone: String,
  balance: { type: Number, default: 0 },
  authorized: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
  registeredAt: { type: Date, default: Date.now }
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

// Sync User Profile
app.post('/api/wallet/sync', apiLimiter, async (req, res) => {
  const { walletId, name, phone } = req.body;
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { walletId },
      { name, phone, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Check Status
app.get('/api/wallet/status/:id', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ walletId: req.params.id });
    if (!wallet) return res.status(404).json({ error: 'Node not found' });
    res.json({
      authorized: wallet.authorized,
      suspended: wallet.suspended,
      balance: wallet.balance
    });
  } catch (err) {
    res.status(500).json({ error: 'Status check failed' });
  }
});

// --- ADMIN CONTROL ROUTES ---

// Create User Manually
app.post('/api/admin/users', async (req, res) => {
  try {
    const { name, phone, balance, walletId, authorized } = req.body;
    const finalId = walletId || 'WP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newUser = new Wallet({
      walletId: finalId,
      name,
      phone,
      balance: balance || 0,
      authorized: authorized !== undefined ? authorized : true
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Manual creation failed' });
  }
});

// Update User Details
app.put('/api/admin/users/:walletId', async (req, res) => {
  try {
    const { name, phone, balance, authorized, suspended } = req.body;
    const wallet = await Wallet.findOneAndUpdate(
      { walletId: req.params.walletId },
      { name, phone, balance, authorized, suspended, lastUpdated: new Date() },
      { new: true }
    );
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Get all users
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await Wallet.find().sort({ registeredAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Toggle Authorization
app.post('/api/admin/authorize', async (req, res) => {
  const { walletId, status } = req.body;
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { walletId },
      { authorized: status, lastUpdated: new Date() },
      { new: true }
    );
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: 'Auth toggle failed' });
  }
});

// Update Balance (Injection)
app.post('/api/admin/update-balance', async (req, res) => {
  const { walletId, amount } = req.body;
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { walletId },
      { $inc: { balance: amount }, lastUpdated: new Date() },
      { new: true }
    );
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: 'Balance update failed' });
  }
});

// Delete User
app.delete('/api/admin/users/:walletId', async (req, res) => {
  try {
    await Wallet.deleteOne({ walletId: req.params.walletId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
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
    res.status(400).json({ error: 'Inquiry failed' });
  }
});

// Serve Static
const DIST_PATH = path.join(__dirname, 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(DIST_PATH));
  app.get('*', (req, res) => res.sendFile(path.join(DIST_PATH, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Authority Core Node active on port ${PORT}`));
