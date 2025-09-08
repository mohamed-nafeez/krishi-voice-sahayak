import express from 'express';

const app = express();
const PORT = 3003;

app.use(express.json());

app.get('/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ message: 'Test works!' });
});

app.post('/test-post', (req, res) => {
  console.log('Test POST route hit!');
  res.json({ message: 'POST test works!', body: req.body });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
