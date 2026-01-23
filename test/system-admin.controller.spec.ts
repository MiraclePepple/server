import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('SystemAdminController', () => {
  let app: INestApplication;
  let token: string;
  let tenantId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login as system admin
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ usernameOrEmail: 'admin@intellisales.com', password: 'admin123' });
    token = loginRes.body.access_token;

    // Register a tenant to test retrieval and deletion
    const tenantRes = await request(app.getHttpServer())
      .post('/tenants/register')
      .send({
        businessName: 'Admin Test Business',
        email: 'admintest@example.com',
        currency: 'USD',
        phoneNumber: '+1234567890',
        password: 'securepassword',
        domain: 'admintest.intellisales.com'
      });
    tenantId = tenantRes.body.tenant.tenantId;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/admin/tenants (GET) - list all tenants', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/tenants')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/admin/tenants/:id (GET) - get tenant by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/admin/tenants/${tenantId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tenant_id', tenantId);
  });

  it('/admin/tenants/:id (DELETE) - delete tenant', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/admin/tenants/${tenantId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('/admin/system-admins (GET) - list all system admins', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/system-admins')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
