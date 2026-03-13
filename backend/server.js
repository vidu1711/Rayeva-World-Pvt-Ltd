const express = require('express');
const config = require('./config');
const { connectDB } = require('./config/database');
const routes = require('./routes');

const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

connectDB().then(() => {
  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${config.port} is already in use. Stop the other process or set PORT in .env (e.g. PORT=3001).`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
});
