import { describe, expect, it } from 'vitest'
import {
  calculateEstimate,
  defaultSelections,
  summarizeSelections,
} from './estimatorConfig'

describe('calculateEstimate', () => {
  it('uses the website base price and a tight range', () => {
    expect(calculateEstimate(defaultSelections)).toEqual({
      midpoint: 500,
      low: 450,
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

  it('adds feature complexity to a SaaS project', () => {
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

    expect(estimate.midpoint).toBe(3875)
    expect(estimate.low).toBe(3500)
    expect(estimate.high).toBe(4275)
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
