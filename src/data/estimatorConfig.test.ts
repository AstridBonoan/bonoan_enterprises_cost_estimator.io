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

    expect(estimate.midpoint).toBe(625)
  })

  it('reaches the website Advanced package price at 8 pages with every option', () => {
    const estimate = calculateEstimate({
      ...defaultSelections,
      pages: 8,
      standardForms: 4,
      advancedForms: 4,
      payment: true,
      emailAutomation: true,
      calendarBooking: true,
      integrationLevel: 'advanced',
      userAuthentication: true,
      multiUserDashboard: true,
    })

    expect(estimate).toEqual({
      midpoint: 1200,
      low: 1200,
      high: 1200,
    })
  })

  it('adds cost above Advanced when the website has more than 8 pages', () => {
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

    expect(estimate).toEqual({
      midpoint: 1600,
      low: 1600,
      high: 1600,
    })
  })

  it('reaches the SaaS Advanced package price when every option is maxed', () => {
    const estimate = calculateEstimate({
      ...defaultSelections,
      projectType: 'saas',
      pages: 10,
      standardForms: 4,
      advancedForms: 4,
      payment: true,
      emailAutomation: true,
      calendarBooking: true,
      integrationLevel: 'advanced',
      userAuthentication: true,
      multiUserDashboard: true,
    })

    expect(estimate).toEqual({
      midpoint: 3200,
      low: 3200,
      high: 3200,
    })
  })

  it('uses one firm package price in the summary at the Advanced ceiling', () => {
    const selections = {
      ...defaultSelections,
      pages: 8,
      standardForms: 4,
      advancedForms: 4,
      payment: true,
      emailAutomation: true,
      calendarBooking: true,
      integrationLevel: 'advanced' as const,
      userAuthentication: true,
      multiUserDashboard: true,
    }
    const summary = summarizeSelections(
      selections,
      calculateEstimate(selections),
    )

    expect(summary).toContain('Advanced package price: $1,200')
    expect(summary).not.toContain('Estimated investment:')
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
    expect(summary).toContain('Recommended offer: $525')
  })
})
