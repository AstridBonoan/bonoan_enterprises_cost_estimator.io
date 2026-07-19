export type ProjectType = 'website' | 'saas'
export type IntegrationLevel = 'none' | 'light' | 'advanced'

export interface EstimatorSelections {
  projectType: ProjectType
  pages: number
  standardForms: number
  advancedForms: number
  payment: boolean
  emailAutomation: boolean
  calendarBooking: boolean
  integrationLevel: IntegrationLevel
  userAuthentication: boolean
  multiUserDashboard: boolean
}

export const estimatorConfig = {
  rangePercent: 0.1,
  roundingIncrement: 25,
  projectTypes: {
    website: {
      label: 'Website Creation',
      basePrice: 500,
      minPrice: 500,
      maxPrice: 1200,
      includedPages: 3,
      description: 'A polished, responsive marketing website built around your goals.',
      referenceTiers: [
        { name: 'Basic', price: 500, summary: '1–3 pages, custom UI, mobile friendly, contact form' },
        { name: 'Standard', price: 800, summary: '3–5 pages, plus lead and application forms' },
        { name: 'Advanced', price: 1200, summary: '6–8 pages, automation, integrations, or checkout' },
      ],
    },
    saas: {
      label: 'SaaS Tool',
      basePrice: 1000,
      minPrice: 1000,
      maxPrice: 3200,
      includedPages: 0,
      description: 'A focused software tool that automates a workflow or business process.',
      referenceTiers: [
        { name: 'Basic', price: 1000, summary: 'Single-purpose feature, data collection, basic integration' },
        { name: 'Standard', price: 1600, summary: 'Process automation, payments, calendar, and email' },
        { name: 'Advanced', price: 3200, summary: 'Authentication, dashboards, and complex workflows' },
      ],
    },
  },
  // Add-on prices are calibrated so selecting every option at the UI maximum
  // lands exactly on the Advanced package price for that project type.
  addOns: {
    website: {
      extraPage: 25,
      standardForm: 25,
      advancedForm: 25,
      payment: 50,
      emailAutomation: 25,
      calendarBooking: 25,
      integration: {
        none: 0,
        light: 25,
        advanced: 50,
      },
      userAuthentication: 50,
      multiUserDashboard: 75,
    },
    saas: {
      extraPage: 0,
      standardForm: 50,
      advancedForm: 100,
      payment: 200,
      emailAutomation: 150,
      calendarBooking: 200,
      integration: {
        none: 0,
        light: 150,
        advanced: 300,
      },
      userAuthentication: 350,
      multiUserDashboard: 400,
    },
  },
} as const

export const defaultSelections: EstimatorSelections = {
  projectType: 'website',
  pages: 3,
  standardForms: 0,
  advancedForms: 0,
  payment: false,
  emailAutomation: false,
  calendarBooking: false,
  integrationLevel: 'none',
  userAuthentication: false,
  multiUserDashboard: false,
}

export interface Estimate {
  midpoint: number
  low: number
  high: number
}

const roundTo = (value: number, increment: number) =>
  Math.round(value / increment) * increment

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function calculateEstimate(selections: EstimatorSelections): Estimate {
  const { projectTypes, addOns, rangePercent, roundingIncrement } = estimatorConfig
  const project = projectTypes[selections.projectType]
  const projectAddOns = addOns[selections.projectType]
  const extraPages =
    selections.projectType === 'website'
      ? Math.max(0, selections.pages - project.includedPages)
      : 0

  const rawMidpoint =
    project.basePrice +
    extraPages * projectAddOns.extraPage +
    selections.standardForms * projectAddOns.standardForm +
    selections.advancedForms * projectAddOns.advancedForm +
    (selections.payment ? projectAddOns.payment : 0) +
    (selections.emailAutomation ? projectAddOns.emailAutomation : 0) +
    (selections.calendarBooking ? projectAddOns.calendarBooking : 0) +
    projectAddOns.integration[selections.integrationLevel] +
    (selections.userAuthentication ? projectAddOns.userAuthentication : 0) +
    (selections.multiUserDashboard ? projectAddOns.multiUserDashboard : 0)

  // Keep estimates inside the published Basic–Advanced package band.
  const midpoint = clamp(
    roundTo(rawMidpoint, roundingIncrement),
    project.minPrice,
    project.maxPrice,
  )
  const low = clamp(
    roundTo(midpoint * (1 - rangePercent), roundingIncrement),
    project.minPrice,
    project.maxPrice,
  )
  const high = clamp(
    roundTo(midpoint * (1 + rangePercent), roundingIncrement),
    project.minPrice,
    project.maxPrice,
  )

  return {
    midpoint,
    low: Math.min(low, midpoint),
    high: Math.max(high, midpoint),
  }
}

export function summarizeSelections(
  selections: EstimatorSelections,
  estimate: Estimate,
): string {
  const project = estimatorConfig.projectTypes[selections.projectType]
  const isAtAdvancedCeiling = estimate.midpoint === project.maxPrice
  const selectedFeatures = [
    selections.payment && 'Stripe/payment checkout',
    selections.emailAutomation && 'Email automation',
    selections.calendarBooking && 'Calendar/booking',
    selections.userAuthentication && 'User authentication/accounts',
    selections.multiUserDashboard && 'Multi-user dashboard',
  ].filter(Boolean)

  return [
    `Project type: ${project.label}`,
    selections.projectType === 'website' ? `Pages: ${selections.pages}` : null,
    `Standard forms: ${selections.standardForms}`,
    `Advanced forms: ${selections.advancedForms}`,
    `Integration level: ${selections.integrationLevel}`,
    `Selected features: ${selectedFeatures.length ? selectedFeatures.join(', ') : 'None'}`,
    isAtAdvancedCeiling
      ? `Advanced package price: $${estimate.midpoint.toLocaleString()}`
      : `Estimated investment: $${estimate.low.toLocaleString()}–$${estimate.high.toLocaleString()}`,
    `Recommended offer: $${estimate.midpoint.toLocaleString()}`,
  ]
    .filter(Boolean)
    .join('\n')
}
