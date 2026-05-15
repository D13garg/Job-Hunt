const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('JobHunt API - Comprehensive Test Suite', () => {
  const timestamp = Date.now();
  let applicantToken;
  let recruiterToken;
  let adminToken;
  let jobId;
  let applicationId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobhunt');

    const applicant = await request(app).post('/api/auth/signup').send({
      username: 'Applicant',
      email: `applicant-${timestamp}@test.com`,
      password: 'test123',
      role: 'applicant'
    });
    applicantToken = applicant.body.token;

    const recruiter = await request(app).post('/api/auth/signup').send({
      username: 'Recruiter',
      email: `recruiter-${timestamp}@test.com`,
      password: 'test123',
      role: 'recruiter',
      companyName: 'Test Corp',
      companyLocation: 'Remote'
    });
    recruiterToken = recruiter.body.token;

    const admin = await request(app).post('/api/auth/login').send({
      email: 'dgarg5_be23@thapar.edu',
      password: '131105'
    });
    adminToken = admin.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // ---------------- HEALTH ----------------
  describe('Health', () => {
    test('GET /', async () => {
      const res = await request(app).get('/').expect(200);
      expect(res.body.message).toContain('API');
    });
  });

  // ---------------- AUTH ----------------
  describe('Authentication', () => {
    test('login success', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: `applicant-${timestamp}@test.com`,
        password: 'test123'
      });

      expect(res.body.token).toBeDefined();
    });

    test('login fail wrong password', async () => {
      await request(app).post('/api/auth/login').send({
        email: `applicant-${timestamp}@test.com`,
        password: 'wrong'
      }).expect(401);
    });

    test('login non-existent user', async () => {
      await request(app).post('/api/auth/login').send({
        email: `no-user-${timestamp}@test.com`,
        password: 'test123'
      }).expect(401);
    });
  });

  // ---------------- JOBS ----------------
  describe('Jobs', () => {
    test('create job (recruiter)', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Dev',
          companyName: 'Test Corp',
          location: 'Remote',
          salary: 100000,
          description: 'Test job',
          category: 'computer'
        })
        .expect(201);

      jobId = res.body.job._id;
    });

    test('create job without auth', async () => {
      await request(app)
        .post('/api/jobs')
        .send({})
        .expect(401);
    });

    test('create job missing fields', async () => {
      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({})
        .expect(500);
    });

    test('get jobs', async () => {
      const res = await request(app).get('/api/jobs').expect(200);
      expect(Array.isArray(res.body.jobs)).toBe(true);
    });

    test('get jobs with filter', async () => {
      const res = await request(app)
        .get('/api/jobs?category=computer')
        .expect(200);

      expect(Array.isArray(res.body.jobs)).toBe(true);
    });

    test('get job by id', async () => {
      const res = await request(app).get(`/api/jobs/${jobId}`).expect(200);
      expect(res.body.title).toBeDefined();
    });

    test('invalid job id', async () => {
      await request(app).get('/api/jobs/invalidid').expect(500);
    });
  });

  // ---------------- APPLICATIONS ----------------
  describe('Applications', () => {
    test('apply to job', async () => {
      const res = await request(app)
        .post(`/api/applications/${jobId}`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ linkedinProfile: 'https://linkedin.com/test' })
        .expect(201);

      applicationId = res.body.application._id;
    });

    test('apply without auth', async () => {
      await request(app)
        .post(`/api/applications/${jobId}`)
        .send({ linkedinProfile: 'test' })
        .expect(401);
    });

    test('duplicate apply', async () => {
      await request(app)
        .post(`/api/applications/${jobId}`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ linkedinProfile: 'https://linkedin.com/test' })
        .expect(409);
    });

    test('apply invalid job', async () => {
      await request(app)
        .post(`/api/applications/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ linkedinProfile: 'test' })
        .expect(404);
    });

    test('withdraw application', async () => {
      const res = await request(app)
        .delete(`/api/applications/${applicationId}/withdraw`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .expect(200);

      expect(res.body.message).toContain('withdrawn');
    });
  });

  // ---------------- BOOKMARKS ----------------
  describe('Bookmarks', () => {
    test('bookmark job', async () => {
      await request(app)
        .post(`/api/bookmarks/${jobId}`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .expect(201);
    });

    test('duplicate bookmark', async () => {
      await request(app)
        .post(`/api/bookmarks/${jobId}`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .expect(409);
    });

    test('get bookmarks', async () => {
      const res = await request(app)
        .get('/api/bookmarks')
        .set('Authorization', `Bearer ${applicantToken}`)
        .expect(200);

      expect(Array.isArray(res.body.bookmarks)).toBe(true);
    });

    test('remove bookmark', async () => {
      const res = await request(app)
        .delete(`/api/bookmarks/${jobId}`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .expect(200);

      expect(res.body.message).toContain('removed');
    });
  });

  // ---------------- AUTHORIZATION ----------------
  describe('Authorization', () => {
    test('applicant cannot create job', async () => {
      await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({
          title: 'X',
          companyName: 'Y',
          location: 'Z',
          salary: 100,
          description: 'Test',
          category: 'computer'
        })
        .expect(403);
    });

    test('recruiter cannot apply', async () => {
      await request(app)
        .post(`/api/applications/${jobId}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ linkedinProfile: 'test' })
        .expect(403);
    });
  });

  // ---------------- ADMIN ----------------
  describe('Admin', () => {
    test('get stats', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.totalUsers).toBeDefined();
    });

    test('get users', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const users = res.body.users || res.body;
      expect(Array.isArray(users)).toBe(true);
    });

    test('non-admin cannot access admin', async () => {
      await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${applicantToken}`)
        .expect(403);
    });
  });

  // ---------------- ERROR ----------------
  describe('Errors', () => {
    test('404 route', async () => {
      await request(app).get('/random-route').expect(404);
    });

    test('invalid query params', async () => {
      await request(app)
        .get('/api/jobs?minSalary=abc&maxSalary=xyz')
        .expect(500);
    });

    test('invalid object id', async () => {
      await request(app)
        .get('/api/jobs/not-a-valid-id')
        .expect(500);
    });
  });
});