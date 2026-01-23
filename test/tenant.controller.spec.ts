import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TenantController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tenants/register (POST) - should register new tenant', async () => {
    const res = await request(app.getHttpServer())
      .post('/tenants/register')
      .send({
        businessName: 'Test Business',
        email: 'testbusiness@example.com',
        currency: 'USD',
        phoneNumber: '+1234567890',
        password: 'securepassword',
        domain: 'testbusiness.intellisales.com'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.tenant).toHaveProperty('tenantId');
    expect(res.body.tenant).toHaveProperty('businessName', 'Test Business');
  });

  it('/tenants/register (POST) - should fail for duplicate email', async () => {
    const res = await request(app.getHttpServer())
      .post('/tenants/register')
      .send({
        businessName: 'Test Business',
        email: 'testbusiness@example.com',
        currency: 'USD',
        phoneNumber: '+1234567890',
        password: 'securepassword',
        domain: 'testbusiness.intellisales.com'
      });
    expect([400, 500]).toContain(res.status);
  });

  it('/admin/tenants (GET) - should list all tenants (system admin)', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ usernameOrEmail: 'admin@intellisales.com', password: 'admin123' });
    const token = loginRes.body.access_token;
    const res = await request(app.getHttpServer())
      .get('/admin/tenants')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
