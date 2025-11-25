# NEERP - Nexa AIBI Elevator ERP System

A comprehensive multi-tenant Enterprise Resource Planning (ERP) system designed specifically for elevator maintenance, installation, and service management companies.

## 🎯 Overview

NEERP is a full-stack web application that helps elevator service companies manage their entire business operations, from lead generation to customer management, AMC (Annual Maintenance Contract) tracking, job scheduling, quotations, and invoicing.

### Key Features

- **Multi-Tenant Architecture** - Each client company has isolated database and data
- **Lead Management** - Track and manage customer leads through the sales pipeline
- **AMC Management** - Handle Annual Maintenance Contracts, renewals, and quotations
- **Job Management** - Schedule and track service jobs, assign engineers, and manage routes
- **Quotation System** - Generate and manage quotations for AMC, new installations, modernization, and on-call services
- **Customer Management** - Maintain customer database with sites and contact information
- **Component Pricing** - Dynamic pricing engine for elevator components and materials
- **Material Management** - Track materials, inventory, and pricing
- **User & Employee Management** - Role-based access control and employee tracking
- **Dashboard & Analytics** - Real-time insights into business operations

## 🏗️ Architecture

### Tech Stack

**Backend:**
- **Framework:** Spring Boot 3.5.0
- **Language:** Java 17
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA / Hibernate
- **Security:** JWT Authentication
- **Build Tool:** Maven

**Frontend:**
- **Framework:** Next.js 15.3.3
- **Language:** JavaScript/React 19
- **Styling:** Tailwind CSS 4
- **HTTP Client:** Axios
- **UI Components:** Custom components with shadcn-style UI
- **State Management:** React Hooks

**Infrastructure:**
- **Email Service:** Resend API
- **reCAPTCHA:** Google reCAPTCHA v2
- **PDF Generation:** jsPDF, html2pdf.js
- **File Processing:** XLSX

### Multi-Tenant Architecture

This application implements a **database-per-tenant** architecture where each client company has:
- Isolated PostgreSQL database
- Independent schema and data
- Dynamic datasource routing
- Automatic schema initialization

For detailed architecture documentation, see [TENANT_ARCHITECTURE.md](./TENANT_ARCHITECTURE.md)

## 📁 Project Structure

```
neerp-clients/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/         # Java source code
│   │   └── com/aibi/neerp/
│   │       ├── amc/           # AMC management modules
│   │       ├── componentpricing/  # Component pricing engine
│   │       ├── config/        # Configuration (tenant, datasource)
│   │       ├── customer/      # Customer management
│   │       ├── employeemanagement/  # Employee management
│   │       ├── leadmanagement/     # Lead management
│   │       ├── login/         # Authentication
│   │       ├── passwordreset/ # Password reset flow
│   │       ├── settings/      # Company settings
│   │       └── user/          # User management
│   ├── src/main/resources/
│   │   └── application.properties  # Configuration
│   └── pom.xml                # Maven dependencies
│
├── frontend/                   # Next.js frontend
│   ├── app/                   # Next.js app router
│   │   ├── api/              # API routes (Next.js)
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard and main app pages
│   │   └── editor/          # Editor pages
│   ├── components/           # React components
│   │   ├── AMC/            # AMC-related components
│   │   ├── Dashboard/      # Dashboard components
│   │   ├── Jobs/           # Job management components
│   │   └── UI/             # Reusable UI components
│   ├── services/            # API service functions
│   ├── utils/               # Utility functions
│   └── package.json         # NPM dependencies
│
├── README.md                 # This file
└── TENANT_ARCHITECTURE.md   # Multi-tenant architecture docs
```

## 🚀 Getting Started

### Prerequisites

- **Java 17+** - [Download](https://adoptium.net/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)
- **Maven 3.6+** - [Download](https://maven.apache.org/)
- **Tenant Service** - External service for tenant configuration (running on port 8081)

### Environment Setup

#### 1. Database Setup

Create a fallback database for Spring Boot initialization:

```sql
CREATE DATABASE fallback_client_db;
CREATE USER postgres WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE fallback_client_db TO postgres;
```

#### 2. Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Database (Fallback - for Spring Boot startup)
spring.datasource.url=jdbc:postgresql://localhost:5432/fallback_client_db
spring.datasource.username=postgres
spring.datasource.password=root

# Tenant Service URL
tenant.service.base-url=http://localhost:8081

# Email Configuration
resend.api.key=your_resend_api_key
resend.from.email=noreply@yourdomain.com

# Password Reset
password.reset.internal.secret=your_secret_key
```

#### 3. Frontend Configuration

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### Installation

#### Backend

```bash
cd backend
mvn clean install
```

#### Frontend

```bash
cd frontend
npm install
```

### Running the Application

#### 1. Start PostgreSQL

Ensure PostgreSQL is running on `localhost:5432`

#### 2. Start Tenant Service

The tenant service should be running on `http://localhost:8081` to provide tenant configurations.

#### 3. Start Backend

```bash
cd backend
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

#### 4. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:3003`

## 🔐 Authentication & Security

### Login Flow

1. User accesses frontend with tenant domain
2. Frontend sends login request with `X-Tenant` header
3. Backend validates tenant and creates datasource
4. User credentials validated against tenant database
5. JWT token generated and returned
6. Token stored in HTTP-only cookie

### Tenant Identification

All API requests must include the `X-Tenant` header:

```http
GET /api/customers
X-Tenant: example.com
```

### Password Reset

- Magic link-based password reset
- Tokens expire after 1 hour
- Email sent via Resend API
- Secure token hashing in database

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication Endpoints

- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/password-reset/request` - Request password reset
- `POST /api/password-reset/reset` - Reset password with token

### Main Modules

#### Lead Management
- `GET /api/leads` - List all leads
- `POST /api/leads` - Create new lead
- `PUT /api/leads/{id}` - Update lead
- `GET /api/leads/{id}` - Get lead details

#### AMC Management
- `GET /api/amc/quotations` - List AMC quotations
- `POST /api/amc/quotations` - Create AMC quotation
- `GET /api/amc/jobs` - List AMC jobs
- `POST /api/amc/jobs` - Create AMC job

#### Customer Management
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/{id}/sites` - Get customer sites

#### Component Pricing
- `GET /api/component-pricing/floors` - Get floors
- `POST /api/component-pricing/floors` - Generate floors
- `GET /api/component-pricing/components` - List components

## 🧪 Development

### Backend Development

#### Adding New Entity

1. Create entity class in appropriate package
2. Create repository interface extending `JpaRepository`
3. Create service class with business logic
4. Create controller with REST endpoints
5. Hibernate will auto-create table on next login

#### Adding Default Data

Edit `TenantDefaultDataInitializer.java`:

```java
private void insertDefaultNewData() {
    if (!repository.existsByField(value)) {
        NewEntity entity = new NewEntity();
        entity.setField(value);
        repository.save(entity);
    }
}
```

### Frontend Development

#### Adding New Page

1. Create page in `app/` directory
2. Add route to navigation in `NavigationAccordion.js`
3. Create components in `components/` directory
4. Add API calls in `services/` or use `axiosInstance`

#### API Integration

```javascript
import axiosInstance from '@/utils/axiosInstance';

// All requests automatically include X-Tenant header
const response = await axiosInstance.get('/api/customers');
```

### Code Style

- **Backend:** Follow Spring Boot conventions, use Lombok for boilerplate
- **Frontend:** Use functional components with hooks, follow Next.js conventions
- **Naming:** camelCase for variables, PascalCase for components/classes

## 🧩 Key Modules

### Lead Management
- Track leads through sales pipeline stages
- Manage customer enquiries (AMC, Installation, Modernization, On-Call)
- Convert leads to customers
- Activity tracking and follow-ups

### AMC Management
- Create and manage AMC quotations
- Track AMC jobs and renewals
- Service scheduling and engineer assignment
- Route management for service visits

### Component Pricing
- Dynamic pricing based on floors, capacity, and lift type
- Material and component management
- Installation rules and pricing calculations
- GST calculation and invoicing

### Customer Management
- Customer database with contact information
- Site management (multiple sites per customer)
- Customer history and activity tracking

### Job Management
- Service job creation and tracking
- Engineer assignment and scheduling
- Job status updates and completion
- Route optimization

## 🔧 Configuration

### Tenant Configuration

Tenants are configured in the external tenant service. Each tenant requires:
- Domain identifier (e.g., `example.com`)
- Database connection details (URL, username, password)
- Active status

### Company Settings

Each tenant can configure:
- Company name, logo, and contact information
- GST details and tax rates
- Bank account information
- Office addresses

### Default Data

On first login, each tenant database is automatically populated with:
- Capacity types, units, contract types
- Enquiry types, payment terms
- Elevator makes, service counts
- Default floors (G+1 to G+20)
- Installation rules and pricing
- Operators, lift types, components
- Material categories and items

## 🐛 Troubleshooting

### Backend Issues

**Issue:** "Tenant not found"
- Verify tenant exists in tenant service
- Check `X-Tenant` header is being sent
- Ensure tenant is active

**Issue:** "Schema initialization failed"
- Check database connection details
- Verify database user has CREATE/ALTER permissions
- Review logs for specific errors

**Issue:** "Wrong database being queried"
- Verify `TenantContext` is set correctly
- Check `TenantFilter` is running
- Ensure no premature `TenantContext.clear()` calls

### Frontend Issues

**Issue:** "401 Unauthorized"
- Check JWT token is valid
- Verify `X-Tenant` header is included
- Ensure user is logged in

**Issue:** "CORS errors"
- Verify backend CORS configuration
- Check frontend API base URL

**Issue:** "reCAPTCHA not working"
- Verify reCAPTCHA site key in environment variables
- Check domain is registered in Google reCAPTCHA console

## 📝 Additional Documentation

- [Multi-Tenant Architecture](./TENANT_ARCHITECTURE.md) - Detailed architecture documentation
- [Password Reset API](./backend/PASSWORD_RESET_API.md) - Password reset implementation
- [reCAPTCHA Setup](./backend/RECAPTCHA_SETUP.md) - reCAPTCHA configuration guide

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly (backend and frontend)
4. Ensure code follows project conventions
5. Submit a pull request

### Development Guidelines

- Write clear commit messages
- Add comments for complex logic
- Update documentation for new features
- Test multi-tenant scenarios
- Ensure idempotent data initialization

## 📄 License

[Specify your license here]

## 👥 Authors

Nexa AIBI Development Team

## 🔗 Related Projects

- **Tenant Service** - External service for tenant configuration management
- **Client Portal** - Customer-facing portal (if applicable)

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check documentation in `/docs` folder

---

**Built with ❤️ for Elevator Service Companies**
