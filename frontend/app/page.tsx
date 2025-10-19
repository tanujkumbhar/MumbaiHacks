'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calculator,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Target,
  Shield,
  Bot,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Menu,
  X,
  Play,
  Pause,
  Volume2,
  Upload,
  FileText,
  Brain,
  Award
} from 'lucide-react'

const TaxWise3DLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(true)
  const heroRef = useRef(null)
  const floatingCardRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
      setCursorPosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const FloatingOrb = ({
    size = 40,
    color = 'bg-blue-200',
    delay = 0,
    duration = 4
  }) => (
    <div
      className={`absolute ${
        size === 60 ? 'w-16 h-16' : size === 80 ? 'w-20 h-20' : 'w-10 h-10'
      } ${color} rounded-full opacity-30 blur-sm animate-pulse pointer-events-none`}
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transform: `translate(${mousePosition.x * 0.1}px, ${
          mousePosition.y * 0.1
        }px)`
      }}
    />
  )

  const services = [
    {
      icon: FileText,
      title: 'Smart Financial Data Ingestion',
      description:
        'Users can upload bank statements, credit card statements, or CSV files. The system automatically cleans, normalizes, and identifies transaction patterns such as recurring income, EMIs, SIPs, rent, and insurance.',
      features: [
        'Automated data cleaning',
        'Pattern recognition', 
        'Multi-format support',
        'Real-time processing'
      ],
      color: 'from-blue-400 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      icon: Brain,
      title: 'AI-Powered Tax Optimization Engine',
      description:
        'Categorizes income and expenses, computes taxable income, applies deductions under relevant sections (80C, 80D, 80G, 24(b), etc.), simulates Old vs New tax regimes, and recommends legal tax-saving opportunities.',
      features: [
        'Smart categorization',
        'Regime comparison',
        'Legal optimization', 
        'Custom recommendations'
      ],
      color: 'from-purple-400 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      icon: Award,
      title: 'CIBIL Score Advisor',
      description:
        'Analyzes credit behavior from financial statements or credit reports, identifies factors impacting your score, and provides actionable recommendations to improve credit health and unlock better opportunities.',
      features: [
        'Credit analysis',
        'Score improvement',
        'Risk assessment',
        'Action plans'
      ],
      color: 'from-green-400 to-teal-600',
      bgColor: 'from-green-50 to-teal-50'
    }
  ]

  const features = [
    {
      icon: Calculator,
      title: 'Smart Tax Planning',
      description:
        'AI-powered tax optimization strategies tailored to your financial situation and goals.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Investment Tracking',
      description:
        'Monitor your portfolio performance and get intelligent investment recommendations.',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: CreditCard,
      title: 'Credit Management',
      description:
        'Track your credit score, manage debt, and improve your financial health.',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: PiggyBank,
      title: 'Budgeting Tools',
      description:
        'Create and stick to budgets with smart spending insights and alerts.',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description:
        'Set and track financial goals with personalized action plans and milestones.',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      icon: Shield,
      title: 'Insurance Planning',
      description:
        'Comprehensive insurance analysis and recommendations for complete protection.',
      color: 'from-teal-400 to-teal-600'
    }
  ]

  const router = useRouter()

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // For external links, you'd handle routing here
       router.push(href)
    } 
  }

  const Navbar = () => (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-blue-100/20'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25'>
              <Zap className='w-5 h-5 text-white' />
            </div>
            <div>
              <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                TaxWise
              </h1>
              <p className='text-xs text-gray-500'>AI Tax Assistant</p>
            </div>
          </div>

          <div className='hidden md:flex items-center space-x-8'>
            <button
              onClick={() => handleNavClick('#features')}
              className='text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer'
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('#services')}
              className='text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer'
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('#pricing')}
              className='text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer'
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick('/auth/login')}
              className='text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer'
            >
              Login
            </button>
            <button
              onClick={() => handleNavClick('/auth/signup')}
              className='bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-full text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 cursor-pointer'
            >
              Get Started
            </button>
          </div>

          <button
            className='md:hidden text-gray-600 cursor-pointer z-50'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg z-40'>
          <div className='px-6 py-4 space-y-4'>
            <button
              onClick={() => {
                handleNavClick('#features')
                setIsMenuOpen(false)
              }}
              className='block text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer w-full text-left'
            >
              Features
            </button>
            <button
              onClick={() => {
                handleNavClick('#services')
                setIsMenuOpen(false)
              }}
              className='block text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer w-full text-left'
            >
              Services
            </button>
            <button
              onClick={() => {
                handleNavClick('#pricing')
                setIsMenuOpen(false)
              }}
              className='block text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer w-full text-left'
            >
              Pricing
            </button>
            <button
              onClick={() => {
                handleNavClick('/auth/login')
                setIsMenuOpen(false)
              }}
              className='block text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer w-full text-left'
            >
              Login
            </button>
            <button
              onClick={() => {
                handleNavClick('/auth/signup')
                setIsMenuOpen(false)
              }}
              className='w-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-full text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer'
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )

  interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
  }
  
  const AnimatedText = ({
    text,
    className,
    delay = 0
  }: AnimatedTextProps) => (
    <div
      className={`absolute text-6xl font-bold opacity-5 select-none pointer-events-none ${className}`}
      style={{
        animation: `textFloat 15s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transform: `translate(${(mousePosition.x - 50) * 0.01}px, ${
          (mousePosition.y - 50) * 0.01
        }px)`,
        transition: 'transform 0.3s ease-out'
      }}
    >
      {text}
    </div>
  )

  const Hero3D = () => (
    <section
      ref={heroRef}
      className='min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center'
    >
      {/* Animated Background */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_50%)]' />
        <div
          className='absolute inset-0 opacity-40'
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147,197,253,0.3), transparent 40%)`
          }}
        />
      </div>

      {/* Interactive Background Text */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <AnimatedText
          text='TAX'
          className='top-20 left-10 text-blue-200 rotate-12'
          delay={0}
        />
        <AnimatedText
          text='INVEST'
          className='top-40 right-20 text-purple-200 -rotate-12'
          delay={2}
        />
        <AnimatedText
          text='SAVE'
          className='top-60 left-1/4 text-green-200 rotate-6'
          delay={4}
        />
        <AnimatedText
          text='PLAN'
          className='bottom-40 right-10 text-orange-200 -rotate-6'
          delay={6}
        />
        <AnimatedText
          text='GROW'
          className='bottom-20 left-20 text-cyan-200 rotate-12'
          delay={8}
        />
        <AnimatedText
          text='AI'
          className='top-1/3 right-1/4 text-pink-200 -rotate-12'
          delay={1}
        />
        <AnimatedText
          text='BUDGET'
          className='bottom-60 left-1/3 text-indigo-200 rotate-6'
          delay={3}
        />
        <AnimatedText
          text='SMART'
          className='top-80 right-1/3 text-teal-200 -rotate-6'
          delay={5}
        />
        <AnimatedText
          text='₹'
          className='top-1/2 left-10 text-yellow-200 rotate-45'
          delay={7}
        />
        <AnimatedText
          text='📊'
          className='bottom-1/3 right-1/2 text-blue-200'
          delay={9}
        />
      </div>

      {/* Floating Orbs */}
      <div className='absolute inset-0 pointer-events-none'>
        <FloatingOrb size={60} color='bg-blue-200' delay={0} duration={6} />
        <FloatingOrb size={40} color='bg-purple-200' delay={1} duration={4} />
        <FloatingOrb size={80} color='bg-cyan-200' delay={2} duration={8} />
        <FloatingOrb size={50} color='bg-pink-200' delay={3} duration={5} />
      </div>

      <div className='max-w-7xl mx-auto px-6 py-20 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8'>
            <div className='inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full px-4 py-2 backdrop-blur-sm shadow-sm'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
              <span className='text-sm text-gray-700 font-medium'>
                🚀 Now with AI-powered insights
              </span>
            </div>

            <h1 className='text-6xl lg:text-8xl font-bold leading-tight'>
              <span className='bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent'>
                Master Your
              </span>
              <br />
              <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent'>
                Finances
              </span>
              <br />
              <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                with AI
              </span>
            </h1>

            <p className='text-xl text-gray-600 leading-relaxed max-w-2xl'>
              The smartest way to optimize taxes, track investments, and achieve
              your financial goals. Powered by advanced AI and trusted by
              thousands of users worldwide.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                onClick={() => handleNavClick('/auth/signup')}
                className='group bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer z-20'
              >
                Start Free Trial
                <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </button>
              <button
                onClick={() => handleNavClick('#features')}
                className='px-8 py-4 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors backdrop-blur-sm cursor-pointer z-20'
              >
                Watch Demo
              </button>
            </div>

            <div className='flex items-center space-x-8 text-sm text-gray-500'>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='w-4 h-4 text-green-500' />
                <span>Free 14-day trial</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='w-4 h-4 text-green-500' />
                <span>No credit card</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='w-4 h-4 text-green-500' />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Card */}
          <div className='relative'>
            <div
              ref={floatingCardRef}
              className='relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:scale-105 hover:rotate-1 shadow-2xl shadow-blue-100/20'
              style={{
                transform: `perspective(1000px) rotateY(${
                  (mousePosition.x - 50) * 0.3
                }deg) rotateX(${(mousePosition.y - 50) * 0.15}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Glowing border effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-10 blur-xl animate-pulse pointer-events-none' />

              <div className='relative z-10 space-y-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg'>
                      <Bot className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='text-gray-900 font-semibold'>
                        AI Assistant
                      </h3>
                      <p className='text-gray-500 text-sm'>Online now</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse' />
                    <span className='text-xs text-gray-500'>Active</span>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='bg-gray-100/80 p-4 rounded-2xl backdrop-blur-sm border border-gray-200/50'>
                    <p className='text-gray-700 text-sm'>
                      "How can I optimize my tax savings for this year?"
                    </p>
                  </div>

                  <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl backdrop-blur-sm border border-blue-200/50'>
                    <p className='text-gray-800 text-sm'>
                      Based on your income and investments, I recommend
                      maximizing your Section 80C deductions and considering
                      ELSS funds. You could save up to ₹1.5L in taxes this year.
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-4 pt-4'>
                  <div className='flex -space-x-2'>
                    <div className='w-8 h-8 bg-gradient-to-br from-pink-400 to-red-400 rounded-full border-2 border-white shadow-sm' />
                    <div className='w-8 h-8 bg-gradient-to-br from-green-400 to-teal-400 rounded-full border-2 border-white shadow-sm' />
                    <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full border-2 border-white shadow-sm' />
                  </div>
                  <span className='text-gray-500 text-sm'>
                    50k+ users trust TaxWise
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes textFloat {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.05;
          }
          25% {
            transform: translateY(-30px) scale(1.1);
            opacity: 0.08;
          }
          50% {
            transform: translateY(-15px) scale(0.95);
            opacity: 0.03;
          }
          75% {
            transform: translateY(-40px) scale(1.05);
            opacity: 0.07;
          }
        }
      `}</style>
    </section>
  )

  const StatsSection = () => (
    <section className='py-20 bg-gradient-to-r from-gray-50 to-blue-50 relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none' />

      <div className='max-w-7xl mx-auto px-6 relative z-10'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {[
            { value: '50K+', label: 'Active Users', icon: '👥' },
            { value: '₹500M+', label: 'Tax Savings', icon: '💰' },
            { value: '99.9%', label: 'Uptime', icon: '⚡' },
            { value: '4.9/5', label: 'User Rating', icon: '⭐' }
          ].map((stat, index) => (
            <div
              key={index}
              className='text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-100/20'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className='text-3xl mb-2'>{stat.icon}</div>
              <div className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                {stat.value}
              </div>
              <div className='text-gray-600 text-sm font-medium'>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const ServicesSection = () => (
    <section
      id='services'
      className='py-24 bg-gradient-to-br from-white via-purple-50 to-blue-50 relative overflow-hidden'
    >
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.1),transparent_50%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.1),transparent_50%)]' />
      </div>

      <div className='max-w-7xl mx-auto px-6 relative z-10'>
        <div className='text-center mb-20 space-y-6'>
          <h2 className='text-5xl lg:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight'>
            Core Services
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Three powerful AI engines working together to transform your financial life
          </p>
        </div>

        <div className='space-y-16'>
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} lg:flex lg:gap-12 items-center`}
            >
              <div className='lg:w-1/2 space-y-8'>
                <div className='flex items-start space-x-6'>
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-xl shadow-blue-200/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <service.icon className='w-10 h-10 text-white' />
                  </div>
                  
                  <div className='flex-1'>
                    <h3 className='text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors'>
                      {service.title}
                    </h3>
                    <p className='text-lg text-gray-600 leading-relaxed mb-6'>
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className='flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-300'
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`} />
                      <span className='text-gray-700 font-medium text-sm'>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='lg:w-1/2 mt-12 lg:mt-0'>
                <div className={`relative p-8 bg-gradient-to-br ${service.bgColor} backdrop-blur-sm rounded-3xl border border-gray-200/50 group-hover:border-gray-300/50 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-4 shadow-2xl shadow-blue-100/30`}>
                  {/* Animated particles */}
                  <div className='absolute inset-0 overflow-hidden rounded-3xl pointer-events-none'>
                    <div className='absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-30' />
                    <div className='absolute bottom-8 left-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-40' />
                    <div className='absolute top-1/2 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-30' />
                  </div>

                  <div className='relative z-10 space-y-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <service.icon className='w-6 h-6 text-white' />
                        </div>
                        <div>
                          <h4 className='text-gray-900 font-semibold text-lg'>
                            {service.title.split(' ').slice(0, 2).join(' ')}
                          </h4>
                          <p className='text-gray-500 text-sm'>Processing...</p>
                        </div>
                      </div>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <CheckCircle className='w-5 h-5 text-green-600' />
                      </div>
                    </div>

                    <div className='space-y-3'>
                      {[
                        'Analyzing financial data...',
                        'Identifying patterns...',
                        'Generating insights...',
                        'Ready for review'
                      ].map((step, stepIndex) => (
                        <div key={stepIndex} className='flex items-center space-x-3'>
                          <div className={`w-2 h-2 rounded-full ${stepIndex < 3 ? 'bg-blue-400 animate-pulse' : 'bg-green-400'}`} />
                          <span className={`text-sm ${stepIndex < 3 ? 'text-gray-600' : 'text-green-600 font-medium'}`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className='pt-4 border-t border-gray-200/50'>
                      <div className='flex items-center space-x-4'>
                        <div className='flex -space-x-2'>
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${service.color} border-2 border-white shadow-sm`} />
                          <div className='w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full border-2 border-white shadow-sm' />
                        </div>
                        <span className='text-gray-500 text-xs'>
                          Powered by AI Engine v2.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const FeaturesSection = () => (
    <section
      id='features'
      className='py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden'
    >
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.1),transparent_50%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(34,197,94,0.1),transparent_50%)]' />
      </div>

      <div className='max-w-7xl mx-auto px-6 relative z-10'>
        <div className='text-center mb-16 space-y-4'>
          <h2 className='text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
            Everything you need
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            From tax optimization to investment tracking, we've got all your
            financial needs covered with cutting-edge AI technology.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='group relative p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:border-gray-300/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-lg shadow-blue-100/20'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500 pointer-events-none`}
              />

              <div className='relative z-10'>
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className='w-8 h-8 text-white' />
                </div>

                <h3 className='text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors'>
                  {feature.title}
                </h3>

                <p className='text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const PricingSection = () => (
    <section
      id='pricing'
      className='py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden'
    >
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.1),transparent_50%)]' />
      </div>

      <div className='max-w-7xl mx-auto px-6 relative z-10'>
        <div className='text-center mb-16 space-y-4'>
          <h2 className='text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
            Simple, Transparent Pricing
          </h2>
          <p className='text-xl text-gray-600'>
            Choose the plan that works best for you
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {[
            {
              name: 'Starter',
              price: 'Free',
              description: 'Perfect for individuals getting started',
              features: [
                'Basic tax planning',
                'Budget tracking',
                'Goal setting',
                'Email support'
              ],
              popular: false
            },
            {
              name: 'Professional',
              price: '₹999',
              period: '/month',
              description: 'For serious financial planning',
              features: [
                'Advanced tax optimization',
                'Investment tracking',
                'Credit monitoring',
                'AI advisor',
                'Priority support',
                'Custom reports'
              ],
              popular: true
            },
            {
              name: 'Enterprise',
              price: '₹2,999',
              period: '/month',
              description: 'For businesses and advisors',
              features: [
                'Everything in Professional',
                'Multi-user accounts',
                'Advanced analytics',
                'API access',
                'Dedicated support',
                'Custom integrations'
              ],
              popular: false
            }
          ].map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl backdrop-blur-sm transition-all duration-500 hover:scale-105 shadow-xl ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300/50 scale-105 shadow-blue-200/50'
                  : 'bg-white/70 border border-gray-200/50 hover:border-gray-300/50 shadow-blue-100/20'
              }`}
            >
              {plan.popular && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 rounded-full text-white text-sm font-medium shadow-lg'>
                  Most Popular
                </div>
              )}

              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                  {plan.name}
                </h3>
                <div className='mb-4'>
                  <span className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className='text-gray-600'>{plan.period}</span>
                  )}
                </div>
                <p className='text-gray-600'>{plan.description}</p>
              </div>

              <div className='space-y-4 mb-8'>
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className='flex items-center space-x-3'
                  >
                    <CheckCircle className='w-5 h-5 text-green-500' />
                    <span className='text-gray-700'>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleNavClick(plan.name === 'Enterprise' ? '/contact' : '/auth/signup')}
                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer z-20 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-300'
                }`}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const CTASection = () => (
    <section className='py-20 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 relative overflow-hidden'>
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_50%)]' />
      </div>

      <div className='max-w-4xl mx-auto px-6 text-center relative z-10'>
        <h2 className='text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
          Ready to transform your financial future?
        </h2>
        <p className='text-xl text-blue-100 mb-8 opacity-90 max-w-2xl mx-auto'>
          Join thousands of users who are already saving money and achieving
          their financial goals with TaxWise.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <button
            onClick={() => handleNavClick('/auth/signup')}
            className='group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 flex items-center cursor-pointer z-20'
          >
            Start Your Free Trial
            <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </button>
          <button
            onClick={() => handleNavClick('#features')}
            className='px-8 py-4 rounded-full border border-white/30 text-white hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer z-20'
          >
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  )

  return (
    <div className='min-h-screen bg-white text-gray-900 overflow-x-hidden'>
      <Navbar />
      <Hero3D />
      <StatsSection />
      <ServicesSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />

      {/* Footer */}
      <footer className='py-16 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
                  <Zap className='w-5 h-5 text-white' />
                </div>
                <div>
                  <h3 className='text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    TaxWise
                  </h3>
                  <p className='text-xs text-gray-500'>AI Tax Assistant</p>
                </div>
              </div>
              <p className='text-sm text-gray-600'>
                The smartest way to manage your finances with AI-powered
                insights and optimization.
              </p>
            </div>

            <div className='space-y-4'>
              <h4 className='font-semibold text-gray-900'>Product</h4>
              <ul className='space-y-2 text-sm text-gray-600'>
                <li>
                  <button
                    onClick={() => handleNavClick('#features')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('#pricing')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/api-docs')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    API
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/dashboard')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>
            <div className='space-y-4'>
              <h4 className='font-semibold text-gray-900'>Support</h4>
              <ul className='space-y-2 text-sm text-gray-600'>
                <li>
                  <button
                    onClick={() => handleNavClick('/help')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/contact')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/auth/login')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/auth/signup')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>
            <div className='space-y-4'>
              <h4 className='font-semibold text-gray-900'>Company</h4>
              <ul className='space-y-2 text-sm text-gray-600'>
                <li>
                  <button
                    onClick={() => handleNavClick('/about')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/careers')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/blog')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('/press')}
                    className='hover:text-gray-900 transition-colors text-left cursor-pointer'
                  >
                    Press
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center'>
            <p className='text-sm text-gray-600'>
              © 2025 TaxWise. All rights reserved.
            </p>
            <div className='flex space-x-6 text-sm text-gray-600 mt-4 md:mt-0'>
              <button
                onClick={() => handleNavClick('/terms')}
                className='hover:text-gray-900 transition-colors cursor-pointer'
              >
                Terms
              </button>
              <button
                onClick={() => handleNavClick('/privacy')}
                className='hover:text-gray-900 transition-colors cursor-pointer'
              >
                Privacy
              </button>
              <button
                onClick={() => handleNavClick('/cookies')}
                className='hover:text-gray-900 transition-colors cursor-pointer'
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TaxWise3DLanding