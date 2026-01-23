import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PermissionController', () => {
  let app: INestApplication;
  let token: string;
  let tenantDbName: string;

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
        businessName: 'Permission Test Business',
        email: 'permissiontest@example.com',
        currency: 'USD',
        phoneNumber: '+1234567890',
        password: 'securepassword',
        domain: 'permissiontest.intellisales.com'
      });
    tenantDbName = tenantRes.body.tenant.tenantIdentifier;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/tenant-login')
      .send({
        tenantIdentifier: tenantDbName,
        usernameOrEmail: 'permissiontest@example.com',
        password: 'securepassword'
      });
    token = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/permissions (GET) - list permissions', async () => {
    const res = await request(app.getHttpServer())
      .get('/permissions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/permissions/module/:module (GET) - list permissions by module', async () => {
    const res = await request(app.getHttpServer())
      .get('/permissions/module/POS')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every((perm: any) => perm.module === 'POS')).toBe(true);
  });
});
