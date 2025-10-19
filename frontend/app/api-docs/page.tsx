'use client'

import dynamic from 'next/dynamic'
import { swaggerSpec } from '@/lib/swagger'
import 'swagger-ui-react/swagger-ui.css'
import { AuthGuard } from '@/components/AuthGuard'

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocs() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TaxWise API Documentation
          </h1>
          <p className="text-lg text-gray-600">
            Complete API documentation for user registration and onboarding system
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg">
          <SwaggerUI 
            spec={swaggerSpec}
            docExpansion="list"
            defaultModelsExpandDepth={2}
            defaultModelExpandDepth={2}
            tryItOutEnabled={true}
            supportedSubmitMethods={['get', 'post', 'put', 'delete']}
            deepLinking={true}
            displayRequestDuration={true}
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
          />
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
