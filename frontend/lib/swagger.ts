export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TaxWise Registration & Onboarding API',
    version: '1.0.0',
    description: 'A comprehensive API for user registration and multi-step onboarding process with MongoDB and Prisma',
    contact: {
      name: 'TaxWise Team',
      email: 'team@taxwise.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'User ID' },
          email: { type: 'string', format: 'email', description: 'User email' },
          firstName: { type: 'string', description: 'First name' },
          lastName: { type: 'string', description: 'Last name' },
          phone: { type: 'string', description: 'Phone number' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation date' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update date' }
        }
      },
      OnboardingData: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Onboarding data ID' },
          userId: { type: 'string', description: 'User ID' },
          dateOfBirth: { type: 'string', format: 'date', description: 'Date of birth' },
          gender: { type: 'string', description: 'Gender' },
          maritalStatus: { type: 'string', description: 'Marital status' },
          address: { type: 'string', description: 'Address' },
          city: { type: 'string', description: 'City' },
          state: { type: 'string', description: 'State' },
          pincode: { type: 'string', description: 'Pincode' },
          annualIncome: { type: 'number', description: 'Annual income' },
          monthlyIncome: { type: 'number', description: 'Monthly income' },
          occupation: { type: 'string', description: 'Occupation' },
          employer: { type: 'string', description: 'Employer' },
          workExperience: { type: 'integer', description: 'Work experience in years' },
          shortTermGoals: { type: 'array', items: { type: 'string' }, description: 'Short-term financial goals' },
          longTermGoals: { type: 'array', items: { type: 'string' }, description: 'Long-term financial goals' },
          riskTolerance: { type: 'string', enum: ['Conservative', 'Moderate', 'Aggressive'], description: 'Risk tolerance' },
          isCompleted: { type: 'boolean', description: 'Whether onboarding is completed' },
          completedSteps: { type: 'array', items: { type: 'string' }, description: 'Completed steps' },
          currentStep: { type: 'string', description: 'Current step in onboarding' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation date' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update date' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string', format: 'email', description: 'User email' },
          password: { type: 'string', minLength: 6, description: 'Password (min 6 characters)' },
          firstName: { type: 'string', description: 'First name' },
          lastName: { type: 'string', description: 'Last name' },
          phone: { type: 'string', description: 'Phone number (optional)' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', description: 'User email' },
          password: { type: 'string', description: 'Password' }
        }
      },
      PersonalInfoRequest: {
        type: 'object',
        properties: {
          dateOfBirth: { type: 'string', format: 'date', description: 'Date of birth' },
          gender: { type: 'string', description: 'Gender' },
          maritalStatus: { type: 'string', description: 'Marital status' },
          address: { type: 'string', description: 'Address' },
          city: { type: 'string', description: 'City' },
          state: { type: 'string', description: 'State' },
          pincode: { type: 'string', description: 'Pincode' }
        }
      },
      FinancialInfoRequest: {
        type: 'object',
        properties: {
          annualIncome: { type: 'number', description: 'Annual income' },
          monthlyIncome: { type: 'number', description: 'Monthly income' },
          occupation: { type: 'string', description: 'Occupation' },
          employer: { type: 'string', description: 'Employer' },
          workExperience: { type: 'integer', description: 'Work experience in years' }
        }
      },
      FinancialGoalsRequest: {
        type: 'object',
        properties: {
          shortTermGoals: { type: 'array', items: { type: 'string' }, description: 'Short-term financial goals' },
          longTermGoals: { type: 'array', items: { type: 'string' }, description: 'Long-term financial goals' },
          riskTolerance: { type: 'string', enum: ['Conservative', 'Moderate', 'Aggressive'], description: 'Risk tolerance' }
        }
      },
      DocumentUploadRequest: {
        type: 'object',
        required: ['documentType', 'documentData', 'fileName', 'fileType'],
        properties: {
          documentType: { type: 'string', enum: ['panCard', 'aadharCard', 'bankStatement', 'salarySlip'], description: 'Type of document' },
          documentData: { type: 'string', description: 'Base64 encoded file data' },
          fileName: { type: 'string', description: 'Original file name' },
          fileType: { type: 'string', description: 'MIME type of the file' }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', description: 'Whether the request was successful' },
          message: { type: 'string', description: 'Response message' },
          data: { type: 'object', description: 'Response data' },
          error: { type: 'string', description: 'Error message (if any)' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', description: 'Whether the request was successful' },
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string', description: 'JWT token' },
          message: { type: 'string', description: 'Response message' }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error or user already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/onboarding': {
      get: {
        summary: 'Get current onboarding status',
        tags: ['Onboarding'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Onboarding status retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/OnboardingData' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create or update onboarding data',
        tags: ['Onboarding'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  personalInfo: { $ref: '#/components/schemas/PersonalInfoRequest' },
                  financialInfo: { $ref: '#/components/schemas/FinancialInfoRequest' },
                  financialGoals: { $ref: '#/components/schemas/FinancialGoalsRequest' },
                  documents: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/DocumentUploadRequest' }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Onboarding data saved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/OnboardingData' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/onboarding/personal-info': {
      post: {
        summary: 'Save personal information (Step 1)',
        tags: ['Onboarding'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PersonalInfoRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Personal information saved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/OnboardingData' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/onboarding/financial-info': {
      post: {
        summary: 'Save financial information (Step 2)',
        tags: ['Onboarding'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FinancialInfoRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Financial information saved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/OnboardingData' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/onboarding/financial-goals': {
      post: {
        summary: 'Save financial goals (Step 3)',
        tags: ['Onboarding'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FinancialGoalsRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Financial goals saved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/OnboardingData' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/onboarding/documents': {
      post: {
        summary: 'Upload documents (Step 4)',
        tags: ['Onboarding'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DocumentUploadRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Document uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/OnboardingData' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/onboarding/complete': {
      post: {
        summary: 'Complete onboarding process',
        tags: ['Onboarding'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Onboarding completed successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/OnboardingData' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '400': {
            description: 'No onboarding data found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    },
    '/user/profile': {
      get: {
        summary: 'Get user profile',
        tags: ['User Profile'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          allOf: [
                            { $ref: '#/components/schemas/User' },
                            {
                              type: 'object',
                              properties: {
                                onboarding: { $ref: '#/components/schemas/OnboardingData' }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update user profile',
        tags: ['User Profile'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', description: 'First name' },
                  lastName: { type: 'string', description: 'Last name' },
                  phone: { type: 'string', description: 'Phone number' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Profile updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/User' }
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          }
        }
      }
    }
  }
}
