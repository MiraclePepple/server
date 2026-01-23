import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController', () => {
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

  it('/auth/login (POST) - system admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ usernameOrEmail: 'admin@intellisales.com', password: 'admin123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body.user).toHaveProperty('isSystemAdmin', true);
  });

  it('/auth/tenant-login (POST) - should fail without tenant', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/tenant-login')
      .send({ tenantIdentifier: 'fake', usernameOrEmail: 'user', password: 'pass' });
    expect([400, 401]).toContain(res.status);
  });

  it('/auth/domain-login (POST) - should fail without valid domain', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/domain-login')
      .set('Host', 'nonexistent.intellisales.com')
      .send({ usernameOrEmail: 'user', password: 'pass' });
    expect([400, 401]).toContain(res.status);
  });
});
