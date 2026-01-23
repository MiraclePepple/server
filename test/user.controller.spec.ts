import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController', () => {
  let app: INestApplication;
  let token: string;
  let tenantDbName: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register a tenant and login to get token and dbName
    const tenantRes = await request(app.getHttpServer())
      .post('/tenants/register')
      .send({
        businessName: 'User Test Business',
        email: 'usertest@example.com',
        currency: 'USD',
        phoneNumber: '+1234567890',
        password: 'securepassword',
        domain: 'usertest.intellisales.com'
      });
    tenantDbName = tenantRes.body.tenant.tenantIdentifier;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/tenant-login')
      .send({
        tenantIdentifier: tenantDbName,
        usernameOrEmail: 'usertest@example.com',
        password: 'securepassword'
      });
    token = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - create user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'newpassword',
        full_name: 'New User',
        phone: '+1111111111',
        roleNames: ['admin']
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    userId = res.body.user_id;
  });

  it('/users (GET) - list users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/users/:id (GET) - get user by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user_id', userId);
  });

  it('/users/:id (PATCH) - update user', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ full_name: 'Updated User', phone: '+2222222222' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('full_name', 'Updated User');
  });

  it('/users/:id (DELETE) - delete user', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
