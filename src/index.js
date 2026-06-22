const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || '1.0.0';

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'DevOps Student Project API',
    version: VERSION,
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/api/info', (req, res) => {
  res.json({
    app: 'devops-project',
    version: VERSION,
    node: process.version,
    env: process.env.NODE_ENV || 'development'
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };