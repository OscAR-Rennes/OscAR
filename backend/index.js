import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'https://<TON_FRONTEND_VERCEL_URL>'
}));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!!!' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});