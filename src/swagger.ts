import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('🚀 IntelliSales POS API')
    .setDescription(`
## 🏢 Multi-Tenant Point of Sale System API

### 📋 **Complete API Documentation**

This API provides comprehensive endpoints for managing a multi-tenant POS system with:
- **Multi-tenant architecture** with database isolation
- **Role-based permissions** (75+ granular permissions)
- **Complete POS functionality** (inventory, customers, sales)
- **Real-time stock management** with multi-location support
- **Customer loyalty programs** with tiers and points

### 🔐 **Authentication**
Use the **Authorize** button above to set your JWT token.

### 🏗️ **API Structure**
**Tenant Management**: Registration, authentication, domain-based access
**User Management**: Users, roles, permissions with CRUD operations
**Product Management**: Products, categories with inventory tracking
**Inventory Management**: Multi-location stock, transfers, adjustments
**Customer Management**: Customer profiles, addresses, loyalty programs
**POS Processing**: Sales transactions, payments, receipts *(Coming Soon)*
**Purchase Management**: Supplier orders, receiving *(Coming Soon)*
**Reporting**: Sales analytics, inventory reports *(Coming Soon)*

### 📊 **Key Features**
- **4/10 Major modules completed** (User, Product, Inventory, Customer)
- **40+ REST endpoints** with full CRUD operations
- **Multi-location inventory** tracking
- **Customer loyalty tiers**: Bronze → Silver → Gold → Platinum
- **Comprehensive permissions**: Each action has individual permissions
- **Real-time stock alerts** and low stock notifications
- **Complete audit trails** for all operations

### 🎯 **Examples Available**
Each endpoint includes comprehensive examples with realistic data.
    `)
    .setVersion('2.0.0')
    .setContact('IntelliSales Support', 'https://intellisales.com', 'support@intellisales.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('🏢 Tenant Management', 'Multi-tenant registration and authentication')
    .addTag('👥 User Management', 'Users, roles, and permissions with CRUD operations')
    .addTag('🛍️ Product Management', 'Product catalog with categories and inventory')
    .addTag('📦 Inventory Management', 'Multi-location stock management and transfers')
    .addTag('👤 Customer Management', 'Customer profiles, addresses, and loyalty programs')
    .addTag('🔒 Authentication', 'JWT-based authentication and authorization')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token (e.g., "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")',
        in: 'header',
      },
      'JWT-auth'
    )
    .addServer('http://localhost:5000', 'Development Server')
    .addServer('https://api.intellisales.com', 'Production Server')
    .build();

  const document = SwaggerModule.createDocument(app as any, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Add custom CSS for better appearance
  const customCss = `
    .swagger-ui .topbar { background-color: #1976d2; }
    .swagger-ui .topbar .download-url-wrapper .select-label { color: white; }
    .swagger-ui .info .title { color: #1976d2; }
    .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
  `;

  SwaggerModule.setup('api', app as any, document, {
    customCss,
    customSiteTitle: 'IntelliSales POS API Documentation',
    customfavIcon: 'https://intellisales.com/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
      docExpansion: 'none', // Don't expand by default
      defaultModelsExpandDepth: 2,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
  });

  console.log(`
🚀 Swagger API Documentation available at: http://localhost:5000/api`);
  console.log(`📊 API Summary: 40+ endpoints across 5 major modules`);
  console.log(`🔐 Use JWT tokens for authenticated requests`);
}
