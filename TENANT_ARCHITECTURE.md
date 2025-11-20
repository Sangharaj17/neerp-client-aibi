# Multi-Tenant Architecture Documentation

## Overview

This application implements a **database-per-tenant** multi-tenant architecture where each tenant (client) has their own isolated PostgreSQL database. The system dynamically routes database connections based on the tenant identifier provided in the HTTP request headers.

## Architecture Pattern

**Type:** Database-per-Tenant (Separate Database)

- Each tenant has a completely isolated PostgreSQL database
- Tenant identification via `X-Tenant` HTTP header
- Dynamic datasource routing at runtime
- Automatic schema initialization on first login
- Idempotent default data initialization on every login

## Key Components

### 1. TenantContext (`TenantContext.java`)

Thread-local storage for the current tenant identifier.

```java
// Sets tenant ID for current thread
TenantContext.setTenantId("example.com");

// Retrieves tenant ID
String tenantId = TenantContext.getTenantId();

// Clears tenant context (important for thread cleanup)
TenantContext.clear();
```

**Key Features:**
- Uses `ThreadLocal<String>` to ensure thread-safe tenant isolation
- Automatically cleared after each request via `TenantFilter`
- Prevents tenant data leakage between requests

### 2. TenantFilter (`TenantFilter.java`)

Servlet filter that extracts tenant identifier from HTTP headers and sets it in `TenantContext`.

**Execution Order:** Runs first (Order = 1) before other filters

**Process:**
1. Extracts `X-Tenant` header from incoming request
2. Sets tenant ID in `TenantContext`
3. Continues request processing
4. Clears `TenantContext` in `finally` block

**Example Request:**
```http
GET /api/customers
X-Tenant: example.com
```

### 3. DynamicRoutingDataSource (`DynamicRoutingDataSource.java`)

Spring's `AbstractRoutingDataSource` implementation that routes database queries to the correct tenant database.

**How it works:**
- Overrides `determineCurrentLookupKey()` to return tenant ID from `TenantContext`
- Spring uses this key to select the appropriate datasource from the pool
- All JPA/Hibernate queries automatically use the correct database

### 4. DataSourceConfig (`DataSourceConfig.java`)

Manages the pool of tenant datasources and creates new ones on demand.

**Key Methods:**

```java
// Add a new tenant datasource
public void addDataSource(String tenantId, Client client)

// Remove a tenant datasource
public void removeDataSource(String tenantId)
```

**Features:**
- Maintains a `ConcurrentHashMap` of tenant datasources
- Creates HikariCP connection pools per tenant
- Reuses existing datasources if already created
- Closes datasources when removed

### 5. TenantSchemaInitializer (`TenantSchemaInitializer.java`)

Handles automatic schema creation and data initialization for tenant databases.

**Initialization Flow:**

#### First-Time Setup (New Tenant)
1. Checks if schema exists (`isInitialized()`)
2. If not, creates all tables using Hibernate's `ddl-auto=update`
3. Runs `TenantDefaultDataInitializer.initializeDefaults()` to insert default data
4. Runs **asynchronously** to avoid blocking login
5. Returns `202 Accepted` with `requiresInitialization: true`

#### Subsequent Logins (Existing Tenant)
1. Detects schema already exists
2. Ensures new tables exist (for schema updates)
3. Runs lightweight data initialization (idempotent checks)
4. Runs **synchronously** (fast, non-blocking)
5. Proceeds with normal login

**Schema Detection:**
```java
// Checks if tenant database has been initialized
boolean isInitialized() {
    // 1. Count total tables (should be > 15)
    // 2. Check for key table existence (tbl_capacity_type)
}
```

### 6. TenantDefaultDataInitializer (`TenantDefaultDataInitializer.java`)

Inserts default/reference data into tenant databases. All operations are **idempotent** (safe to run multiple times).

**Initialization Steps (16 steps):**

1. **CapacityTypes** - Person, Weight
2. **Unit** - Kg
3. **ContractTypes** - Non-Comprehensive, Semi-Comprehensive, Comprehensive
4. **EnquiryTypes** - AMC, New Installation, Modernization, On Call
5. **PaymentTerms** - Quarterly, Half Yearly, Yearly
6. **ElevatorMakes** - KONE, Schindler, Otis, etc.
7. **NumberOfServices** - 1-12
8. **Default Floors** - G+1 to G+20 (20 floors)
9. **InstallationRules** - Pricing rules for different lift types and floors
10. **Operators** - Manual, Automatic
11. **TypeOfLift** - GEARED, GEAREDLESS, HYDRAULIC
12. **Components** - VFD, Door Operator, Machine Set, etc.
13. **OtherMaterialMain Truffing** - Material categories
14. **OtherMaterials** - Common and operator-specific materials
15. **AdditionalFloors** - Terrace, Basement floors
16. **AirTypes** - FAN, BLOWER

**Idempotent Design:**
- Checks if data exists before inserting
- Uses repository `existsBy*` methods
- Safe to run on every login
- Prevents duplicate data

## Request Flow

### Login Flow

```
1. Frontend sends login request with X-Tenant header
   ↓
2. TenantFilter extracts X-Tenant and sets TenantContext
   ↓
3. LoginController receives request
   ↓
4. ClientService fetches tenant config from tenant service
   ↓
5. DataSourceConfig creates/retrieves tenant datasource
   ↓
6. TenantSchemaInitializer checks if schema exists
   ↓
7a. If NEW: Creates schema + data (async) → Returns 202
7b. If EXISTS: Ensures data initialized (sync) → Continues
   ↓
8. UserService validates credentials against tenant DB
   ↓
9. JWT token generated with tenant ID
   ↓
10. Response sent with token cookie
   ↓
11. TenantFilter clears TenantContext
```

### API Request Flow

```
1. Frontend sends API request with X-Tenant header
   ↓
2. TenantFilter extracts X-Tenant and sets TenantContext
   ↓
3. DynamicRoutingDataSource determines lookup key
   ↓
4. Spring routes to correct tenant datasource
   ↓
5. Controller/Service executes business logic
   ↓
6. All JPA queries automatically use tenant database
   ↓
7. Response returned
   ↓
8. TenantFilter clears TenantContext
```

## Tenant Configuration

### Client Entity Structure

Each tenant is represented by a `Client` object stored in a central tenant service:

```java
public class Client {
    private Long id;
    private String clientName;      // Display name
    private String domain;           // Tenant identifier (e.g., "example.com")
    private String dbUrl;            // PostgreSQL connection URL
    private String dbUsername;       // Database username
    private String dbPassword;       // Database password
    private Boolean isActive;        // Tenant status
}
```

### Tenant Service

The tenant configuration is fetched from an external service:

**Configuration:**
```properties
tenant.service.base-url=http://localhost:8081
```

**Endpoint:**
```
GET /api/clients/domain/{domain}
```

## Database Schema

### Central Database (Tenant Service)
- Stores tenant configurations
- Manages tenant metadata
- Separate from tenant databases

### Tenant Databases
- Each tenant has isolated PostgreSQL database
- All application tables are created per tenant
- Schema managed by Hibernate (`ddl-auto=update`)
- Default data inserted via `TenantDefaultDataInitializer`

## Adding a New Tenant

### 1. Create Tenant Configuration

Add tenant record to central tenant service:

```json
{
  "clientName": "Example Company",
  "domain": "example.com",
  "dbUrl": "jdbc:postgresql://localhost:5432/example_db",
  "dbUsername": "example_user",
  "dbPassword": "secure_password",
  "isActive": true
}
```

### 2. Create PostgreSQL Database

```sql
CREATE DATABASE example_db;
CREATE USER example_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE example_db TO example_user;
```

### 3. First Login

When a user from `example.com` logs in:
- System fetches tenant config
- Creates datasource connection
- Detects new schema (no tables exist)
- Runs schema initialization (async)
- Returns `202 Accepted` with initialization message
- Frontend polls for completion

### 4. Subsequent Logins

After initialization:
- System detects existing schema
- Runs lightweight data checks (idempotent)
- Proceeds with normal login

## Frontend Integration

### Setting Tenant Header

All API requests must include the tenant identifier:

```javascript
// Using axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'X-Tenant': getTenantId() // e.g., from domain or config
  }
});
```

### Login Request

```javascript
POST /api/login
Headers:
  X-Tenant: example.com
Body:
  {
    "email": "user@example.com",
    "password": "password123"
  }
```

### Handling Initialization

```javascript
// Login response may indicate initialization needed
if (response.data.requiresInitialization) {
  // Show loading message
  // Poll for initialization status
  // Redirect to login when complete
}
```

## Configuration

### Application Properties

```properties
# Tenant Service URL
tenant.service.base-url=http://localhost:8081

# Fallback Database (for Spring Boot startup)
spring.datasource.url=jdbc:postgresql://localhost:5432/fallback_client_db
spring.datasource.username=postgres
spring.datasource.password=root

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy
```

## Security Considerations

### Tenant Isolation

- **Thread-local storage** ensures tenant context is isolated per request
- **Automatic cleanup** prevents tenant leakage between requests
- **Database-level isolation** provides complete data separation

### Best Practices

1. **Always set X-Tenant header** in frontend requests
2. **Validate tenant exists** before processing requests
3. **Check tenant is active** before allowing operations
4. **Never trust client-provided tenant ID** - validate against authenticated user's tenant
5. **Clear TenantContext** in finally blocks to prevent leaks

## Troubleshooting

### Issue: "Tenant not found"

**Cause:** Tenant not registered in central tenant service

**Solution:**
- Verify tenant exists in tenant service database
- Check `domain` field matches `X-Tenant` header
- Ensure `isActive = true`

### Issue: "Schema initialization failed"

**Cause:** Database connection issues or insufficient permissions

**Solution:**
- Verify database exists and is accessible
- Check database user has CREATE/ALTER permissions
- Review logs for specific error messages

### Issue: "No tenant header found"

**Cause:** Frontend not sending `X-Tenant` header

**Solution:**
- Ensure `axiosInstance` includes `X-Tenant` header
- Check middleware/interceptors are configured correctly
- Verify tenant ID is available in frontend context

### Issue: "Wrong database being queried"

**Cause:** TenantContext not set or cleared prematurely

**Solution:**
- Verify `TenantFilter` is running (check logs)
- Ensure `TenantContext.setTenantId()` is called before database operations
- Check for premature `TenantContext.clear()` calls

## Adding New Default Data

To add new default data that should be inserted for all tenants:

1. **Add to TenantDefaultDataInitializer.java:**
   ```java
   private void insertDefaultNewData() {
       try {
           if (!newDataRepository.existsByField(value)) {
               NewData data = new NewData();
               data.setField(value);
               newDataRepository.save(data);
               System.out.println("[DataInit] ✅ Inserted NewData: " + value);
           }
       } catch (Exception e) {
           System.err.println("[DataInit] Error inserting NewData: " + e.getMessage());
           throw e;
       }
   }
   ```

2. **Add step to initializeDefaults():**
   ```java
   System.out.println("[DataInit] Step X/16: Inserting NewData...");
   insertDefaultNewData();
   System.out.println("[DataInit] Step X/16: ✅ Completed");
   ```

3. **Ensure idempotency:**
   - Always check if data exists before inserting
   - Use repository `existsBy*` methods
   - Handle exceptions gracefully

## Schema Updates

When adding new entities or modifying existing ones:

1. **Hibernate automatically handles:**
   - New tables (created on next login)
   - New columns (added to existing tables)
   - Column type changes (altered automatically)

2. **Manual table creation:**
   - For complex tables, add to `TenantSchemaInitializer.ensureTableExists()`
   - Called on every login to ensure new tables exist

3. **Data migrations:**
   - Add migration logic to `TenantDefaultDataInitializer`
   - Make it idempotent (check before migrating)

## Performance Considerations

### Datasource Pooling

- Each tenant datasource uses HikariCP with max 10 connections
- Datasources are cached and reused across requests
- Old datasources are removed and recreated on login

### Initialization Performance

- **First-time setup:** Async (non-blocking)
- **Subsequent logins:** Sync but fast (idempotent checks)
- **Data initialization:** Only inserts missing data

### Thread Safety

- `TenantContext` uses `ThreadLocal` (thread-safe)
- `DataSourceConfig` uses `ConcurrentHashMap` (thread-safe)
- All repository operations are thread-safe (Spring Data JPA)

## Monitoring and Logging

### Key Log Messages

```
[Login] Processing login for tenant: example.com
[Login] Added datasource for tenant: example.com
[TenantInit] Schema exists for tenant: example.com
[DataInit] Step 1/16: Inserting CapacityTypes...
[DataInit] ✅ Inserted CapacityType: Person
```

### Debugging

Enable debug logging:
```properties
logging.level.com.aibi.neerp=DEBUG
```

## Summary

This multi-tenant architecture provides:

✅ **Complete data isolation** - Each tenant has separate database  
✅ **Automatic schema management** - Tables created/updated automatically  
✅ **Idempotent data initialization** - Safe to run multiple times  
✅ **Dynamic datasource routing** - Automatic database selection  
✅ **Thread-safe operations** - No tenant data leakage  
✅ **Scalable design** - Easy to add new tenants  

The system handles tenant identification, database routing, schema initialization, and data setup automatically, requiring minimal manual intervention.

