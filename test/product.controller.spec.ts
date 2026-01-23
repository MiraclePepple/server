import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProductController', () => {
  let app: INestApplication;
  let token: string;
  let tenantDbName: string;
  let productId: string;

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
        businessName: 'Product Test Business',
        email: 'producttest@example.com',
        currency: 'USD',
        phoneNumber: '+1234567890',
        password: 'securepassword',
        domain: 'producttest.intellisales.com'
      });
    tenantDbName = tenantRes.body.tenant.tenantIdentifier;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/tenant-login')
      .send({
        tenantIdentifier: tenantDbName,
        usernameOrEmail: 'producttest@example.com',
        password: 'securepassword'
      });
    token = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (POST) - create product', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        type: 'simple',
        price: 10.99
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('product_id');
    productId = res.body.product_id;
  });

  it('/products (GET) - list products', async () => {
    const res = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/products/:id (GET) - get product by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('product_id', productId);
  });
});
