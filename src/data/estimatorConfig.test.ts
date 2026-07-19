import { describe, expect, it } from 'vitest'
import {
  calculateEstimate,
  defaultSelections,
  summarizeSelections,
} from './estimatorConfig'

describe('calculateEstimate', () => {
  it('uses the website base price and stays at or above Basic', () => {
    expect(calculateEstimate(defaultSelections)).toEqual({
      midpoint: 500,
      low: 500,
      high: 550,
    })
  })

  it('adds website pages only after the three included pages', () => {
    const estimate = calculateEstimate({
      ...defaultSelections,
      pages: 6,
    })

    expect(estimate.midpoint).toBe(875)
  })

  it('caps website estimates at the Advanced package price', () => {
    const estimate = calculateEstimate({
      ...defaultSelections,
      pages: 12,
      standardForms: 4,
      advancedForms: 4,
      payment: true,
      emailAutomation: true,
      calendarBooking: true,
      integrationLevel: 'advanced',
      userAuthentication: true,
      multiUserDashboard: true,
    })

    expect(estimate.midpoint).toBe(1200)
    expect(estimate.low).toBe(1075)
    expect(estimate.high).toBe(1200)
  })

  it('caps SaaS estimates at the Advanced package price', () => {
    const estimate = calculateEstimate({
      ...defaultSelections,
      projectType: 'saas',
      pages: 10,
      advancedForms: 1,
      payment: true,
      integrationLevel: 'advanced',
      userAuthentication: true,
      multiUserDashboard: true,
    })

    expect(estimate.midpoint).toBe(3200)
    expect(estimate.low).toBe(2875)
    expect(estimate.high).toBe(3200)
  })

  it('includes selections and prices in the submission summary', () => {
    const selections = {
      ...defaultSelections,
      emailAutomation: true,
    }
    const summary = summarizeSelections(
      selections,
      calculateEstimate(selections),
    )

    expect(summary).toContain('Project type: Website Creation')
    expect(summary).toContain('Email automation')
    expect(summary).toContain('Recommended offer: $750')
  })
})
