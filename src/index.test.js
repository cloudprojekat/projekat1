const request = require('supertest');
const { app, server } = require('./index');

afterAll((done) => {
  server.close(done);
});

describe('GET /', () => {
  it('should return 200 and app info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('status', 'running');
  });
});

describe('GET /health', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });
});

describe('GET /api/info', () => {
  it('should return app info', async () => {
    const res = await request(app).get('/api/info');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('app', 'devops-project');
    expect(res.body).toHaveProperty('node');
  });
});