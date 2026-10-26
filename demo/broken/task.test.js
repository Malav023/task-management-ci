const request = require('supertest');
const app = require('../src/app');
const validateTask = require('../src/utils/validateTask');

describe('validateTask()', () => {
  test('accepts a valid task', () => {
    const result = validateTask({ title: 'Buy milk', status: 'pending' });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('rejects a task with an empty title', () => {
    const result = validateTask({ title: '   ' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Title is required');
  });

  test('rejects an invalid status', () => {
    const result = validateTask({ title: 'Test', status: 'done-ish' });
    expect(result.isValid).toBe(false);
  });
});

describe('API endpoints', () => {
  test('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('down'); // DELIBERATELY BROKEN
  });

  test('POST /api/tasks without a title returns 400', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'no title' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain('Title is required');
  });
});
