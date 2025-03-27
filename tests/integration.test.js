// tests/integration.test.js
const request = require('supertest');
const app = require('../src/app'); // Adjust path if needed

describe('Integration Tests for Express App', () => {
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