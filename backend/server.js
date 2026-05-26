import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🚦 The Routing Hub
// Any request that starts with /api/chat gets sent to the chatRoutes Traffic Cop
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'success', message: 'Professional AI Engine Backend is live!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});