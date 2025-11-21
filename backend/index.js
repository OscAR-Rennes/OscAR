import express from 'express';
import cors from 'cors';

const app = express();

// Autoriser le front Vercel
app.use(cors({
  origin: 'https://oscar-deploiement.vercel.app'
}));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Heddlldddfdfdod ffdfdfdrosfffdme gfdqsdfffbackvcbvcbddend!' });
});

// Utiliser le port fourni par Railway
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
