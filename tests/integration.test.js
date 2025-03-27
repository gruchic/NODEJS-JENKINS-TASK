// tests/integration.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Integration Tests for Express App', () => {
  let server;

  // Start server before all tests
  beforeAll(() => {
    server = app.listen(0); // Use port 0 to pick an available port
  });

  // Close server after all tests
  afterAll((done) => {
    server.close(done); // Pass done to signal Jest when complete
  });

  it('GET / should return "Hello World!" with status 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
    expect(response.headers['content-type']).toMatch(/text/);
  });

  it('GET /nonexistent should return 404', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
    expect(response.text).toContain('Cannot GET /nonexistent');
  });
});