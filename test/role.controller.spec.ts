import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('RoleController', () => {
  let app: INestApplication;
  let token: string;
  let tenantDbName: string;
  let roleId: string;

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
        businessName: 'Role Test Business',
        email: 'roletest@example.com',
        currency: 'USD',
        phoneNumber: '+1234567890',
        password: 'securepassword',
        domain: 'roletest.intellisales.com'
      });
    tenantDbName = tenantRes.body.tenant.tenantIdentifier;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/tenant-login')
      .send({
        tenantIdentifier: tenantDbName,
        usernameOrEmail: 'roletest@example.com',
        password: 'securepassword'
      });
    token = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/roles (POST) - create role', async () => {
    const res = await request(app.getHttpServer())
      .post('/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'cashier',
        description: 'Cashier role',
        permissionNames: ['create_sales', 'process_payments']
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('role_id');
    roleId = res.body.role_id;
  });

  it('/roles (GET) - list roles', async () => {
    const res = await request(app.getHttpServer())
      .get('/roles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/roles/:id (GET) - get role by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('role_id', roleId);
  });

  it('/roles/:id (PUT) - update role', async () => {
    const res = await request(app.getHttpServer())
      .put(`/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Updated cashier role', permissionNames: ['create_sales'] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('description', 'Updated cashier role');
  });

  it('/roles/:id (DELETE) - delete role', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
