# TaxWise AI - API Documentation

## Overview

TaxWise AI is a comprehensive financial analysis platform that provides AI-powered tax calculation, optimization, and CIBIL score analysis for Indian users. The API is built with FastAPI and provides endpoints for document processing, tax calculations, credit analysis, and financial optimization.

**Base URL:** `http://localhost:8000`  
**API Version:** 2.0.0  
**Content-Type:** `application/json`

## Table of Contents

1. [Authentication](#authentication)
2. [General Endpoints](#general-endpoints)
3. [Tax Calculation Endpoints](#tax-calculation-endpoints)
4. [CIBIL Analysis Endpoints](#cibil-analysis-endpoints)
5. [Data Processing Endpoints](#data-processing-endpoints)
6. [Testing Endpoints](#testing-endpoints)
7. [Data Models](#data-models)
8. [Error Handling](#error-handling)
9. [Rate Limits](#rate-limits)

---

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible. Future versions may include JWT-based authentication.

---

## General Endpoints

### 1. Root Endpoint

**GET** `/`

Returns basic information about the API and its capabilities.

#### Response
```json
{
  "message": "TaxWise AI - Complete Financial Analysis Platform",
  "version": "2.0.0",
  "status": "active",
  "agents": {
    "tax_agent_status": "ready",
    "cibil_agent_status": "ready",
    "data_ingestion_agent_status": "ready"
  },
  "capabilities": [
    "Smart document processing (PDF, CSV, Excel, Images)",
    "Tax liability calculation (Old vs New regime)",
    "Investment recommendations for tax saving",
    "Personalized tax optimization strategies",
    "CIBIL score analysis and improvement strategies",
    "Credit scenario simulation",
    "Comprehensive financial reports"
  ]
}
```

### 2. Health Check

**GET** `/api/health`

Returns the health status of the API and all agents.

#### Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "agents": {
    "tax_agent_ready": true,
    "cibil_agent_ready": true,
    "data_ingestion_agent_ready": true
  },
  "configuration": {
    "groq_api_configured": true,
    "tax_agent_mode": "real",
    "cibil_agent_mode": "real",
    "data_ingestion_mode": "real"
  }
}
```

---

## Tax Calculation Endpoints

### 1. Calculate Tax

**POST** `/api/calculate-tax`

Calculates tax liability for both old and new tax regimes based on income and deductions.

#### Request Body
```json
{
  "annual_income": 1200000,
  "investments_80c": 150000,
  "health_insurance": 25000,
  "home_loan_interest": 200000,
  "hra_claimed": 100000,
  "other_deductions": {
    "medical_expenses": 15000,
    "donations": 10000
  }
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `annual_income` | float | Yes | Annual income in INR |
| `investments_80c` | float | No | Section 80C investments (max ₹1.5L) |
| `health_insurance` | float | No | Health insurance premium (Section 80D) |
| `home_loan_interest` | float | No | Home loan interest (Section 24) |
| `hra_claimed` | float | No | HRA claimed amount |
| `other_deductions` | object | No | Additional deductions as key-value pairs |

#### Response
```json
{
  "status": "success",
  "tax_analysis": {
    "old_regime": {
      "gross_income": 1200000,
      "total_deductions": 490000,
      "taxable_income": 710000,
      "tax_liability": 45000,
      "effective_rate": 3.75
    },
    "new_regime": {
      "gross_income": 1200000,
      "total_deductions": 0,
      "taxable_income": 1200000,
      "tax_liability": 120000,
      "effective_rate": 10.0
    },
    "recommendation": "old_regime",
    "savings": 75000
  },
  "breakdown": {
    "deductions_used": {
      "80c": 150000,
      "80d": 25000,
      "24": 200000,
      "hra": 100000,
      "other": 15000
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Optimize Tax Strategy

**POST** `/api/optimize-tax`

Provides comprehensive tax optimization strategies based on user profile.

#### Request Body
```json
{
  "age": 32,
  "annual_income": 1500000,
  "existing_investments": {
    "elss": 50000,
    "ppf": 100000,
    "nps": 25000
  },
  "risk_appetite": "moderate",
  "family_size": 3,
  "city_tier": "metro"
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `age` | int | Yes | User's age |
| `annual_income` | float | Yes | Annual income in INR |
| `existing_investments` | object | No | Current investments breakdown |
| `risk_appetite` | string | No | Risk preference: "conservative", "moderate", "aggressive" |
| `family_size` | int | No | Number of family members |
| `city_tier` | string | No | City classification: "metro", "tier1", "tier2" |

#### Response
```json
{
  "status": "success",
  "optimization_strategy": {
    "recommended_regime": "old_regime",
    "potential_savings": 180000,
    "investment_plan": {
      "elss": 150000,
      "ppf": 150000,
      "nps": 50000,
      "health_insurance": 50000,
      "home_loan_interest": 200000
    },
    "timeline": "12 months",
    "risk_assessment": "moderate"
  },
  "monthly_action_plan": [
    "Invest ₹12,500 monthly in ELSS funds",
    "Increase PPF contribution to ₹12,500/month",
    "Consider NPS additional contribution of ₹4,167/month"
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Tax Query

**POST** `/api/tax-query`

Handles quick tax-related questions and provides basic calculations.

#### Request Body
```json
{
  "question": "What's my tax liability if I earn ₹10 lakhs per year?",
  "income_details": {
    "annual_income": 1000000
  }
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `question` | string | Yes | Tax-related question |
| `income_details` | object | No | Basic income information |

#### Response
```json
{
  "status": "success",
  "question": "What's my tax liability if I earn ₹10 lakhs per year?",
  "response": {
    "old_regime_tax": 25000,
    "new_regime_tax": 50000,
    "recommendation": "old_regime",
    "savings": 25000
  },
  "note": "This is a basic calculation. For detailed advice, use the calculate-tax or optimize-tax endpoints.",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## CIBIL Analysis Endpoints

### 1. Analyze CIBIL Score

**POST** `/api/analyze-cibil`

Comprehensive CIBIL score analysis and improvement recommendations.

#### Request Body
```json
{
  "current_score": 750,
  "payment_history": "good",
  "credit_cards": 3,
  "total_credit_limit": 500000,
  "current_utilization": 25.0,
  "loans": 1,
  "missed_payments": 0,
  "account_age_months": 60,
  "recent_inquiries": 2,
  "age": 30,
  "income": 800000
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `current_score` | int | No | Current CIBIL score (0-900) |
| `payment_history` | string | No | Payment history: "excellent", "good", "fair", "poor" |
| `credit_cards` | int | Yes | Number of active credit cards |
| `total_credit_limit` | float | Yes | Total credit limit across all cards |
| `current_utilization` | float | Yes | Current credit utilization percentage |
| `loans` | int | Yes | Number of active loans |
| `missed_payments` | int | No | Number of missed payments in last 2 years |
| `account_age_months` | int | Yes | Age of oldest credit account in months |
| `recent_inquiries` | int | No | Credit inquiries in last 6 months |
| `age` | int | No | User's age |
| `income` | float | No | Annual income in INR |

#### Response
```json
{
  "status": "success",
  "cibil_analysis": {
    "current_score": 750,
    "score_category": "good",
    "key_factors": {
      "payment_history": "excellent",
      "credit_utilization": "good",
      "credit_mix": "fair",
      "new_credit": "good"
    },
    "improvement_areas": [
      "Diversify credit mix with secured loans",
      "Maintain low utilization below 30%",
      "Avoid multiple credit applications"
    ],
    "recommendations": [
      "Consider a home loan for credit mix improvement",
      "Keep credit utilization under 30%",
      "Pay bills on time consistently"
    ]
  },
  "score_projection": {
    "3_months": 760,
    "6_months": 775,
    "12_months": 790
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Simulate CIBIL Scenarios

**POST** `/api/cibil-scenarios`

Simulates the impact of different actions on CIBIL score.

#### Request Body
```json
{
  "scenarios": [
    {
      "action": "pay_off_credit_card",
      "amount": 100000,
      "description": "Pay off ₹1L credit card debt"
    },
    {
      "action": "apply_home_loan",
      "amount": 5000000,
      "description": "Apply for ₹50L home loan"
    },
    {
      "action": "close_old_card",
      "card_age": 24,
      "description": "Close oldest credit card"
    }
  ]
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scenarios` | array | Yes | Array of scenario objects with action details |

#### Response
```json
{
  "status": "success",
  "scenario_results": [
    {
      "action": "pay_off_credit_card",
      "score_impact": "+15",
      "new_score": 765,
      "timeline": "1-2 months",
      "confidence": "high"
    },
    {
      "action": "apply_home_loan",
      "score_impact": "-10",
      "new_score": 740,
      "timeline": "immediate",
      "confidence": "medium"
    },
    {
      "action": "close_old_card",
      "score_impact": "-5",
      "new_score": 745,
      "timeline": "immediate",
      "confidence": "high"
    }
  ],
  "best_strategy": "pay_off_credit_card",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Generate CIBIL Report

**POST** `/api/cibil-report`

Generates a comprehensive CIBIL improvement report.

#### Request Body
```json
{
  "age": 28,
  "income": 600000,
  "current_score": 680,
  "credit_experience": "3-5 years",
  "goals": "Improve credit score for home loan"
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `age` | int | Yes | User's age |
| `income` | float | Yes | Annual income in INR |
| `current_score` | int | Yes | Current CIBIL score |
| `credit_experience` | string | No | Credit experience level |
| `goals` | string | No | Credit improvement goals |

#### Response
```json
{
  "status": "success",
  "comprehensive_report": {
    "executive_summary": "Your CIBIL score of 680 is below average. Focus on payment history and credit utilization.",
    "current_status": {
      "score": 680,
      "category": "fair",
      "key_issues": ["High credit utilization", "Limited credit mix"]
    },
    "improvement_plan": {
      "immediate_actions": [
        "Reduce credit card balances to under 30%",
        "Set up automatic payments",
        "Avoid new credit applications"
      ],
      "medium_term": [
        "Consider a secured loan for credit mix",
        "Increase credit limits on existing cards",
        "Monitor credit report monthly"
      ],
      "long_term": [
        "Maintain diverse credit portfolio",
        "Keep utilization low consistently",
        "Build strong payment history"
      ]
    },
    "timeline": "6-12 months for significant improvement",
    "expected_outcome": "Score increase to 750+"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 4. Get Sample CIBIL Data

**GET** `/api/cibil-sample-data`

Generates sample CIBIL data for testing purposes.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `num_users` | int | No | Number of sample users to generate (default: 10) |

#### Response
```json
{
  "status": "success",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "sample_count": 10,
  "data": [
    {
      "user_id": 1,
      "current_score": 750,
      "credit_cards": 2,
      "total_credit_limit": 300000,
      "current_utilization": 25.0,
      "loans": 1,
      "account_age_months": 48
    }
  ],
  "note": "This is sample data for testing. Use analyze-cibil endpoint with this data."
}
```

---

## Data Processing Endpoints

### 1. Analyze Financial Data

**POST** `/api/analyze-financial-data`

Processes uploaded financial documents using AI Data Ingestion Agent.

#### Request
- **Content-Type:** `multipart/form-data`
- **Body:** File upload (PDF, CSV, Excel, Images)

#### Supported File Types
- PDF (`.pdf`)
- CSV (`.csv`)
- Excel (`.xlsx`, `.xls`)
- Images (`.png`, `.jpg`, `.jpeg`)
- Text (`.txt`)

#### Response
```json
{
  "status": "success",
  "document_analysis": {
    "document_type": "bank_statement",
    "confidence_level": 0.85,
    "extracted_data": {
      "transactions": [
        {
          "date": "2024-01-01",
          "amount": 75000,
          "category": "income",
          "description": "SALARY CREDIT"
        }
      ],
      "summary": {
        "total_income": 900000,
        "total_expenses": 600000,
        "savings": 300000
      }
    }
  },
  "financial_summary": {
    "ready_for_tax_analysis": true,
    "ready_for_cibil_analysis": false,
    "confidence_level": 0.85,
    "document_type": "bank_statement"
  },
  "tax_agent_format": {
    "annual_income": 900000,
    "investments_80c": 0,
    "health_insurance": 0,
    "home_loan_interest": 0
  },
  "cibil_agent_format": {
    "credit_cards": 0,
    "total_credit_limit": 0,
    "current_utilization": 0,
    "loans": 0
  },
  "enhanced_analysis": {
    "tax_analysis": {
      "old_regime_tax": 25000,
      "new_regime_tax": 50000
    },
    "cibil_analysis": null,
    "analysis_ready": {
      "tax_ready": true,
      "cibil_ready": false
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Test Data Ingestion

**POST** `/api/test-data-ingestion`

Tests data ingestion capabilities with a sample file.

#### Request
- **Content-Type:** `multipart/form-data`
- **Body:** File upload

#### Response
```json
{
  "test_status": "success",
  "filename": "sample_statement.csv",
  "data_extracted": true,
  "formats_ready": {
    "tax_agent": true,
    "cibil_agent": false
  },
  "confidence_level": 0.85,
  "document_type": "bank_statement"
}
```

---

## Testing Endpoints

### 1. Test All Agents

**GET** `/api/test-agents`

Tests all agents (tax, CIBIL, data ingestion) with sample data.

#### Response
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "tax_agent": {
    "status": "success",
    "result": "Tax calculation completed",
    "response_source": "groq"
  },
  "cibil_agent": {
    "status": "success",
    "result": "CIBIL analysis completed",
    "response_source": "groq"
  },
  "data_ingestion_agent": {
    "status": "success",
    "result": "Document processing completed",
    "formats_ready": {
      "tax": true,
      "cibil": false
    },
    "response_source": "groq"
  }
}
```

---

## Data Models

### TaxCalculationRequest
```json
{
  "annual_income": "float (required)",
  "investments_80c": "float (optional, default: 0)",
  "health_insurance": "float (optional, default: 0)",
  "home_loan_interest": "float (optional, default: 0)",
  "hra_claimed": "float (optional, default: 0)",
  "other_deductions": "object (optional, default: {})"
}
```

### TaxOptimizationRequest
```json
{
  "age": "int (required)",
  "annual_income": "float (required)",
  "existing_investments": "object (optional, default: {})",
  "risk_appetite": "string (optional, default: 'moderate')",
  "family_size": "int (optional, default: 1)",
  "city_tier": "string (optional, default: 'metro')"
}
```

### CibilAnalysisRequest
```json
{
  "current_score": "int (optional, default: 0)",
  "payment_history": "string (optional, default: 'unknown')",
  "credit_cards": "int (required)",
  "total_credit_limit": "float (required)",
  "current_utilization": "float (required)",
  "loans": "int (required)",
  "missed_payments": "int (optional, default: 0)",
  "account_age_months": "int (required)",
  "recent_inquiries": "int (optional, default: 0)",
  "age": "int (optional, default: 30)",
  "income": "float (optional, default: 500000)"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Endpoint not found |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server/agent error |

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong",
  "status_code": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Common Error Scenarios

1. **Agent Not Initialized (500)**
   ```json
   {
     "detail": "Tax agent not initialized"
   }
   ```

2. **Invalid File Type (400)**
   ```json
   {
     "detail": "Unsupported file type. Allowed: .csv, .xlsx, .xls, .pdf, .txt, .png, .jpg, .jpeg"
   }
   ```

3. **Validation Error (422)**
   ```json
   {
     "detail": [
       {
         "loc": ["body", "annual_income"],
         "msg": "field required",
         "type": "value_error.missing"
       }
     ]
   }
   ```

---

## Rate Limits

Currently, there are no rate limits implemented. However, the following guidelines are recommended:

- **Tax Calculations:** 100 requests per minute per IP
- **CIBIL Analysis:** 50 requests per minute per IP
- **Document Processing:** 20 requests per minute per IP
- **Testing Endpoints:** 10 requests per minute per IP

---

## Getting Started

### 1. Start the Server

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Access API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI JSON:** http://localhost:8000/openapi.json

### 3. Test the API

```bash
# Health check
curl http://localhost:8000/api/health

# Calculate tax
curl -X POST http://localhost:8000/api/calculate-tax \
  -H "Content-Type: application/json" \
  -d '{"annual_income": 1000000, "investments_80c": 150000}'
```

---

## Support

For API support and questions:
- **Documentation:** This file
- **Interactive Docs:** http://localhost:8000/docs
- **Version:** 2.0.0

---

*Last Updated: January 15, 2024*
