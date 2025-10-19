# TaxWise - Financial Management Platform

A comprehensive financial management platform built with Next.js 14, featuring user registration, multi-step onboarding, and financial planning tools.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Multi-Step Onboarding**: Comprehensive user onboarding process
- **Financial Planning**: Budgeting, investment tracking, and goal setting
- **Credit Management**: CIBIL score analysis and credit recommendations
- **Tax Center**: Tax regime simulation and deduction tracking
- **AI Copilot**: Intelligent financial assistance
- **Document Management**: Secure document storage and management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **API Documentation**: Swagger UI
- **Package Manager**: Bun

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Bun (recommended) or npm/yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd frontend
bun install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.template .env

# Edit .env with your MongoDB credentials
nano .env
```

Required environment variables:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/taxwise?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-for-hackathon-2024"
```

### 3. Database Setup

```bash
# Generate Prisma client
bun run db:generate

# Push schema to MongoDB
bun run db:push
```

### 4. Start Development Server

```bash
bun dev
```

Visit `http://localhost:3000` to see the application.

## 📚 API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:3000/api-docs`

### API Endpoints Overview

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Onboarding
- `GET /api/onboarding` - Get onboarding status
- `POST /api/onboarding` - Create/update onboarding data
- `POST /api/onboarding/personal-info` - Save personal information
- `POST /api/onboarding/financial-info` - Save financial information
- `POST /api/onboarding/financial-goals` - Save financial goals
- `POST /api/onboarding/documents` - Upload documents
- `POST /api/onboarding/complete` - Complete onboarding

#### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🧪 Testing

### Test API Endpoints

```bash
# Run the test script
bun run test:api
```

### Manual Testing

Use the Swagger UI at `http://localhost:3000/api-docs` to test endpoints interactively.

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── onboarding/    # Onboarding endpoints
│   │   └── user/          # User profile endpoints
│   ├── api-docs/          # Swagger UI documentation
│   └── [pages]/           # Application pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── [feature]/        # Feature-specific components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Prisma client
│   ├── swagger.ts        # Swagger configuration
│   └── validations.ts    # Zod validation schemas
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔧 Available Scripts

```bash
# Development
bun dev                    # Start development server
bun build                  # Build for production
bun start                  # Start production server
bun lint                   # Run ESLint

# Database
bun run db:generate        # Generate Prisma client
bun run db:push           # Push schema to database

# Testing
bun run test:api          # Test API endpoints
```

## 🗄️ Database Schema

### User Model
- Basic user information (email, name, phone)
- Password (hashed with bcrypt)
- Timestamps

### OnboardingData Model
- Personal information (DOB, gender, address)
- Financial information (income, occupation)
- Financial goals and risk tolerance
- Document storage (base64 encoded)
- Onboarding progress tracking

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Zod schema validation
- **Protected Routes**: Middleware-based protection
- **CORS Configuration**: Secure cross-origin requests

## 📱 Features Overview

### Dashboard
- Financial summary and overview
- Cash flow visualization
- Tax saving meter

### Budgeting
- Expense tracking and categorization
- Budget planning and monitoring

### Investments
- Portfolio dashboard
- Holdings view
- Capital gains harvesting
- Investment synchronization

### Credit Hub
- CIBIL score analysis
- Credit utilization tracking
- Credit recommendations
- Scenario simulation

### Tax Center
- Income and expense tracking
- Deduction breakdown
- Tax regime simulation
- Audit-proof document vault

### AI Copilot
- Intelligent financial assistance
- Personalized recommendations

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api-docs`

## 🎯 Hackathon Notes

This is an MVP implementation designed for hackathon use with:
- ✅ Complete user registration and authentication
- ✅ Multi-step onboarding process
- ✅ File upload and storage
- ✅ Comprehensive API documentation
- ✅ Modern UI with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ MongoDB for flexible data storage

Perfect for demonstrating a full-stack financial management solution!
