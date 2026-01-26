# 🚀 IntelliSales POS API - Complete Endpoints Summary

## 📊 **API Overview**
- **Total Endpoints**: 40+
- **Completed Modules**: 4/10 (User, Product, Inventory, Customer)
- **Authentication**: JWT Bearer Token
- **Architecture**: Multi-tenant with database isolation
- **Documentation**: Swagger UI at `http://localhost:5000/api`

---

## 🏢 **1. TENANT MANAGEMENT**

### **Tenant Registration & Authentication**

| Method | Endpoint | Description | Example |
|--------|----------|-------------|----------|
| `POST` | `/tenants/register` | Create new tenant business | Register "SuperMart Store" |
| `POST` | `/auth/login` | System admin login | Platform administrators only |
| `POST` | `/auth/admin-login` | **Quick Tenant Admin Login** - Development/localhost | Login with email only |
| `POST` | `/auth/domain-login` | **Production User Login** - Tenant auto-detected | Login via "supermart.intellisales.com" |

> **💡 Authentication Guide**: 
> - **Development**: Use `/auth/admin-login` with tenant admin email - works on localhost
> - **Production**: Users visit their domain and use `/auth/domain-login`
> - **Domain Auto-Generation**: Leave domain field empty → "ACME Corp" becomes "acme-corp.intellisales.com"

**Example Registration (Domain Auto-Generated):**
```json
{
  "businessName": "SuperMart Store",
  "email": "owner@supermart.com",
  "currency": "USD",
  "phoneNumber": "+1-555-123-4567",
  "password": "SecurePass123!"
}
```

---

## 👥 **2. USER MANAGEMENT**

### **Users CRUD**
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|--------------------|
| `POST` | `/users` | Create new user | `users:create` |
| `GET` | `/users` | List all users (paginated) | `users:read` |
| `GET` | `/users/:id` | Get user details | `users:read` |
| `PATCH` | `/users/:id` | Update user info | `users:update` |
| `DELETE` | `/users/:id` | Delete user | `users:delete` |
| `GET` | `/users/export` | Export user data | `users:export` |

### **Roles CRUD**
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|--------------------|
| `POST` | `/roles` | Create new role | `roles:create` |
| `GET` | `/roles` | List all roles | `roles:read` |
| `GET` | `/roles/:id` | Get role details | `roles:read` |
| `PUT` | `/roles/:id` | Update role | `roles:update` |
| `DELETE` | `/roles/:id` | Delete role | `roles:delete` |

### **Permissions**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/permissions` | List all 75+ permissions |
| `GET` | `/permissions/module/:module` | Get permissions by module |

**Example User Creation:**
```json
{
  "username": "cashier_john",
  "email": "john@supermart.com",
  "full_name": "John Smith",
  "password": "CashierPass123!",
  "phone": "+1-555-234-5678",
  "role_ids": ["uuid-cashier-role-id"]
}
```

---

## 🛍️ **3. PRODUCT MANAGEMENT**

### **Products CRUD**
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|--------------------|
| `POST` | `/products` | Create new product | `products:create` |
| `GET` | `/products` | List products (paginated) | `products:read` |
| `GET` | `/products/:id` | Get product details | `products:read` |
| `PATCH` | `/products/:id` | Update product | `products:update` |
| `DELETE` | `/products/:id` | Delete product | `products:delete` |
| `GET` | `/products/export` | Export product data | `products:export` |
| `POST` | `/products/import` | Import products via Excel | `products:import` |

### **Categories CRUD**
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|--------------------|
| `POST` | `/categories` | Create category | `categories:create` |
| `GET` | `/categories` | List categories | `categories:read` |
| `GET` | `/categories/:id` | Get category details | `categories:read` |
| `PATCH` | `/categories/:id` | Update category | `categories:update` |
| `DELETE` | `/categories/:id` | Delete category | `categories:delete` |

**Example Product Creation:**
```json
{
  "name": "Premium Coffee Beans",
  "sku": "COFFEE-PREM-001",
  "barcode": "1234567890123",
  "price": 24.99,
  "cost_price": 15.50,
  "type": "inventory",
  "description": "Premium Arabica coffee beans, 1lb bag",
  "category_id": "uuid-beverages-category-id",
  "low_stock_threshold": 10,
  "expiry_date": "2025-12-31"
}
```

---

## 📦 **4. INVENTORY MANAGEMENT**

### **Stock Operations**
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|--------------------|
| `GET` | `/inventory` | Get all inventory (filtered) | `inventory:read` |
| `GET` | `/inventory/product/:id` | Get stock by product | `inventory:read` |
| `GET` | `/inventory/location/:id` | Get stock by location | `inventory:read` |
| `GET` | `/inventory/low-stock` | Get low stock alerts | `inventory:read` |
| `POST` | `/inventory/adjust` | Manual stock adjustment | `inventory:adjust` |
| `POST` | `/inventory/transfer` | Transfer between locations | `inventory:transfer` |
| `POST` | `/inventory/reserve` | Reserve stock for orders | `inventory:update` |
| `POST` | `/inventory/release-reserve` | Release reserved stock | `inventory:update` |

### **Stock Movements & Audit**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/inventory/movements` | Complete stock movement history |
| `GET` | `/inventory/movements/product/:id` | Product movement history |
| `GET` | `/inventory/export` | Export inventory data |

### **Location Management**
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|--------------------|
| `POST` | `/locations` | Create store/warehouse | `locations:create` |
| `GET` | `/locations` | List all locations | `locations:read` |
| `GET` | `/locations/:id` | Get location details | `locations:read` |
| `PATCH` | `/locations/:id` | Update location | `locations:update` |
| `DELETE` | `/locations/:id` | Delete location | `locations:delete` |

**Example Stock Adjustment:**
```json
{
  "product_id": "uuid-coffee-product-id",
  "location_id": "uuid-main-store-id",
  "new_quantity": 25,
  "reason": "Physical count adjustment",
  "notes": "Found extra inventory in back room"
}
```

**Example Stock Transfer:**
```json
{
  "product_id": "uuid-coffee-product-id",
  "from_location_id": "uuid-warehouse-id",
  "to_location_id": "uuid-main-store-id",
  "quantity": 10,
  "notes": "Restocking main store"
}
```

---

## 👤 **5. CUSTOMER MANAGEMENT**

### **Customer CRUD**
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|--------------------|
| `POST` | `/customers` | Create new customer | `customers:create` |
| `GET` | `/customers` | List customers (filtered) | `customers:read` |
| `GET` | `/customers/stats` | Customer analytics dashboard | `customers:read` |
| `GET` | `/customers/search?q=term` | Search customers | `customers:read` |
| `GET` | `/customers/:id` | Get customer details | `customers:read` |
| `PATCH` | `/customers/:id` | Update customer | `customers:update` |
| `DELETE` | `/customers/:id` | Soft delete customer | `customers:delete` |
| `GET` | `/customers/export` | Export customer data | `customers:export` |

### **Customer Loyalty & Points**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/customers/:id/loyalty-points` | Add/subtract/set loyalty points |

### **Customer Address Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/customers/:id/addresses` | Get all customer addresses |
| `POST` | `/customers/:id/addresses` | Add new address |
| `PATCH` | `/customers/:id/addresses/:aid` | Update address |
| `DELETE` | `/customers/:id/addresses/:aid` | Delete address |

**Example Customer Creation:**
```json
{
  "first_name": "Sarah",
  "last_name": "Johnson",
  "email": "sarah.johnson@email.com",
  "phone": "+1-555-345-6789",
  "date_of_birth": "1985-03-15",
  "gender": "female",
  "address": "456 Oak Street, Apt 2B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "tags": ["VIP", "frequent_buyer"],
  "preferences": {
    "communication_preference": "email",
    "marketing_opt_in": true
  }
}
```

**Customer Statistics Response:**
```json
{
  "totalCustomers": 1247,
  "activeCustomers": 1156,
  "newThisMonth": 89,
  "loyaltyTierDistribution": [
    { "tier": "bronze", "count": 650 },
    { "tier": "silver", "count": 398 },
    { "tier": "gold", "count": 156 },
    { "tier": "platinum", "count": 43 }
  ],
  "topSpenders": [
    {
      "customer_id": "uuid-customer-id",
      "full_name": "John Premium",
      "email": "john@email.com",
      "total_spent": 2458.99
    }
  ]
}
```

---

## 🔐 **6. AUTHENTICATION & AUTHORIZATION**

### **JWT Token Structure**
```json
{
  "sub": "user-uuid",
  "email": "user@tenant.com",
  "tenantId": "tenant-uuid",
  "tenantDbName": "supermart_abc123",
  "roles": ["cashier", "inventory-staff"],
  "permissions": [
    "products:read",
    "inventory:read",
    "customers:create",
    "pos:create_sale"
  ],
  "iat": 1640995200,
  "exp": 1641081600
}
```

### **Permission System (75+ Permissions)**

#### **Module-based Permissions:**
- **Users**: `users:create`, `users:read`, `users:update`, `users:delete`, `users:export`
- **Products**: `products:create`, `products:read`, `products:update`, `products:delete`, `products:export`, `products:import`
- **Inventory**: `inventory:create`, `inventory:read`, `inventory:update`, `inventory:delete`, `inventory:adjust`, `inventory:transfer`, `inventory:export`
- **Customers**: `customers:create`, `customers:read`, `customers:update`, `customers:delete`, `customers:export`, `customers:import`
- **POS**: `pos:create_sale`, `pos:read_sales`, `pos:update_sale`, `pos:delete_sale`, `pos:refund`, `pos:discount`
- **Locations**: `locations:create`, `locations:read`, `locations:update`, `locations:delete`
- **Reports**: `reports:sales`, `reports:inventory`, `reports:customers`, `reports:financial`, `reports:export`

---

## 📊 **7. QUERY PARAMETERS & FILTERING**

### **Pagination (All List Endpoints)**
```
?page=1&limit=10
```

### **Product Filtering**
```
/products?category=beverages&search=coffee&type=inventory&page=1&limit=20
```

### **Customer Filtering**
```
/customers?status=active&loyalty_tier=gold&city=New York&search=john&page=1
```

### **Inventory Filtering**
```
/inventory?location_id=uuid-store-id&search=coffee&page=1&limit=50
/inventory/low-stock?location_id=uuid-store-id&limit=20
```

---

## 🚨 **8. ERROR RESPONSES**

### **Standard Error Format**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    "email must be a valid email address",
    "password must be at least 8 characters long"
  ]
}
```

### **Common HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

---

## 🎯 **9. TESTING WITH SWAGGER**

### **Step 1: Access Swagger UI**
Navigate to: `http://localhost:5000/api`

### **Step 2: Register a Tenant**
1. Use `POST /tenants/register` with example data
2. Save the returned tenant information

### **Step 3: Login**
1. Use `POST /auth/tenant-login` with tenant credentials
2. Copy the JWT token from the response

### **Step 4: Authorize**
1. Click the **"Authorize"** button in Swagger UI
2. Paste your JWT token
3. Click **"Authorize"**

### **Step 5: Test Endpoints**
All protected endpoints are now accessible with your token!

---

## 🔮 **10. COMING SOON (6 Remaining Modules)**

### **POS Processing Module** *(Priority Next)*
- `POST /pos/transactions` - Create sale transaction
- `GET /pos/transactions` - List sales
- `POST /pos/payments` - Process payments (cash, card, digital)
- `POST /pos/refunds` - Process refunds
- `GET /pos/receipts/:id` - Generate receipts

### **Purchase Management Module**
- `POST /suppliers` - Supplier management
- `POST /purchase-orders` - Create purchase orders
- `POST /purchases` - Receive inventory

### **Reporting & Analytics Module**
- `GET /reports/sales` - Sales reports
- `GET /reports/inventory` - Inventory reports
- `GET /reports/customers` - Customer analytics
- `GET /reports/financial` - Financial reports

### **System Settings Module**
- `PUT /settings/company` - Company settings
- `PUT /settings/printer` - Receipt printer config
- `PUT /settings/currency` - Currency settings

---

## 📈 **API Performance & Features**
- ✅ **Multi-tenant architecture** with database isolation
- ✅ **JWT-based authentication** with role-based permissions
- ✅ **Real-time inventory tracking** across multiple locations
- ✅ **Complete audit trails** for all operations
- ✅ **Comprehensive validation** with detailed error messages
- ✅ **Pagination support** for all list endpoints
- ✅ **Advanced filtering** and search capabilities
- ✅ **Customer loyalty program** with automatic tier upgrades
- ✅ **Stock reservation system** for order processing
- ✅ **Multi-location support** for franchise operations

---

🎉 **Ready to explore? Visit:** `http://localhost:5000/api`