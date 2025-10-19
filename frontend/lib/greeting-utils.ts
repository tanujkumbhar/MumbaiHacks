// Utility functions for generating intelligent greetings
// Inspired by Context7's approach to context-aware content generation

export interface GreetingContext {
  timeOfDay: string
  dayType: 'weekend' | 'weekday'
  season: string
  isHolidaySeason: boolean
  financialContext: string
  userPreferences?: {
    formal: boolean
    includeMotivation: boolean
    includeFinancialTips: boolean
  }
}

export interface GreetingOptions {
  userName: string
  currentTime: Date
  userPreferences?: {
    formal: boolean
    includeMotivation: boolean
    includeFinancialTips: boolean
  }
}

export function generateIntelligentGreeting(options: GreetingOptions): string {
  const { userName, currentTime, userPreferences = {} } = options
  
  // Get time-based greeting
  const timeBasedGreeting = getTimeBasedGreeting(currentTime)
  
  // Generate context
  const context = generateGreetingContext(currentTime, userPreferences)
  
  // Create personalized greeting
  return createPersonalizedGreeting(timeBasedGreeting, userName, context)
}

function getTimeBasedGreeting(currentTime: Date): string {
  const hour = currentTime.getHours()
  
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Good night'
}

function generateGreetingContext(currentTime: Date, userPreferences: any): GreetingContext {
  const hour = currentTime.getHours()
  const dayOfWeek = currentTime.getDay()
  const month = currentTime.getMonth()
  
  return {
    timeOfDay: getTimeContext(hour),
    dayType: dayOfWeek === 0 || dayOfWeek === 6 ? 'weekend' : 'weekday',
    season: getSeasonContext(month),
    isHolidaySeason: month === 11 || month === 0, // December or January
    financialContext: getFinancialContext(hour, dayOfWeek),
    userPreferences: {
      formal: false,
      includeMotivation: true,
      includeFinancialTips: true,
      ...userPreferences
    }
  }
}

function getTimeContext(hour: number): string {
  if (hour >= 5 && hour < 9) return 'early_morning'
  if (hour >= 9 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 14) return 'lunch'
  if (hour >= 14 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  if (hour >= 20 && hour < 23) return 'night'
  return 'late_night'
}

function getSeasonContext(month: number): string {
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

function getFinancialContext(hour: number, dayOfWeek: number): string {
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const isBusinessHours = hour >= 9 && hour < 17 && !isWeekend
  
  if (isBusinessHours) return 'work_finance'
  if (isWeekend) return 'weekend_finance'
  if (hour >= 17 && hour < 21) return 'evening_finance'
  return 'personal_finance'
}

function createPersonalizedGreeting(
  timeBasedGreeting: string,
  userName: string,
  context: GreetingContext
): string {
  const { timeOfDay, dayType, season, isHolidaySeason, financialContext, userPreferences } = context
  
  // Base greeting
  let greeting = `${timeBasedGreeting}, ${userName}!`
  
  // Add contextual elements based on preferences
  const contextualElements = []
  
  if (userPreferences?.includeMotivation) {
    contextualElements.push(...getMotivationalElements(timeOfDay, dayType, financialContext))
  }
  
  if (userPreferences?.includeFinancialTips) {
    contextualElements.push(...getFinancialTips(season, isHolidaySeason, financialContext))
  }
  
  // Add time-specific elements
  contextualElements.push(...getTimeSpecificElements(timeOfDay, dayType))
  
  // Combine greeting with contextual elements
  if (contextualElements.length > 0) {
    const randomElement = contextualElements[Math.floor(Math.random() * contextualElements.length)]
    greeting += ` ${randomElement}`
  }
  
  return greeting
}

function getMotivationalElements(timeOfDay: string, dayType: string, financialContext: string): string[] {
  const elements = []
  
  switch (timeOfDay) {
    case 'early_morning':
      elements.push("Hope you have a productive day ahead")
      break
    case 'morning':
      elements.push("Ready to tackle your financial goals today?")
      break
    case 'afternoon':
      elements.push("How's your day going?")
      break
    case 'evening':
      elements.push("Hope you had a great day")
      break
    case 'night':
      elements.push("Winding down for the day?")
      break
  }
  
  if (dayType === 'weekend') {
    elements.push("Hope you're enjoying your weekend")
  }
  
  return elements
}

function getFinancialTips(season: string, isHolidaySeason: boolean, financialContext: string): string[] {
  const tips = []
  
  if (season === 'winter' && isHolidaySeason) {
    tips.push("Perfect time for year-end financial planning")
  } else if (season === 'spring') {
    tips.push("Great time for fresh financial starts")
  }
  
  switch (financialContext) {
    case 'work_finance':
      tips.push("Let's optimize your finances")
      break
    case 'weekend_finance':
      tips.push("Time to review your financial progress")
      break
    case 'evening_finance':
      tips.push("Perfect time for financial planning")
      break
    case 'personal_finance':
      tips.push("Focus on your personal financial goals")
      break
  }
  
  return tips
}

function getTimeSpecificElements(timeOfDay: string, dayType: string): string[] {
  const elements = []
  
  if (timeOfDay === 'late_night') {
    elements.push("Still working on your finances?")
  }
  
  if (timeOfDay === 'lunch') {
    elements.push("Hope you're having a great day")
  }
  
  return elements
}

// Export for testing
export {
  getTimeBasedGreeting,
  generateGreetingContext,
  createPersonalizedGreeting
}
