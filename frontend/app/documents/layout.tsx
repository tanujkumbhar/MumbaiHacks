import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Document Management | TaxWise AI',
  description: 'Upload and manage your financial documents for AI-powered analysis',
}

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
