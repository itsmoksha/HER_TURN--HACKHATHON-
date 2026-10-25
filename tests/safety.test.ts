/**
 * HER TURN — Safety Detector Test Suite
 *
 * Tests the red-flag keyword detector and triage classification system.
 * These are the safety rules the AI enforces on every user message.
 */

import { assessSafety, getTriageCard, RED_FLAG_KEYWORDS } from '../lib/ai/safety-detector'

describe('assessSafety — CRITICAL / URGENT flags', () => {
  test('chest pain + difficulty breathing → urgent', () => {
    const result = assessSafety('I have chest pain and difficulty breathing')
    expect(result.triageLevel).toBe('urgent')
    expect(result.isSafe).toBe(false)
    expect(result.flaggedKeywords.length).toBeGreaterThan(0)
    expect(result.urgentCareMessage).toBeDefined()
  })

  test('heavy bleeding → urgent', () => {
    const result = assessSafety("I've been having heavy bleeding for 3 days")
    expect(result.triageLevel).toBe('urgent')
    expect(result.isSafe).toBe(false)
    expect(result.urgentCareMessage).toMatch(/102|112|emergency/i)
  })

  test('self-harm ideation → urgent with emergency message', () => {
    const result = assessSafety('I feel like I want to hurt myself')
    expect(result.triageLevel).toBe('urgent')
    expect(result.isSafe).toBe(false)
    expect(result.urgentCareMessage).toBeDefined()
    expect(result.urgentCareMessage!.length).toBeGreaterThan(10)
  })

  test('suicidal keywords → urgent', () => {
    const result = assessSafety('I want to kill myself')
    expect(result.triageLevel).toBe('urgent')
    expect(result.isSafe).toBe(false)
  })

  test('severe abdominal pain during pregnancy → urgent', () => {
    const result = assessSafety('I have severe abdominal pain during pregnancy')
    expect(result.triageLevel).toBe('urgent')
    expect(result.isSafe).toBe(false)
  })

  test('reduced fetal movement → urgent', () => {
    const result = assessSafety("I've noticed reduced fetal movement since yesterday")
    expect(result.triageLevel).toBe('urgent')
    expect(result.isSafe).toBe(false)
  })
})

describe('assessSafety — CAUTION flags', () => {
  test('prolonged fever → caution or urgent', () => {
    const result = assessSafety("I've had a fever for 5 days")
    expect(result.isSafe).toBe(false)
    expect(['caution', 'urgent']).toContain(result.triageLevel)
  })

  test('persistent vomiting → not safe', () => {
    const result = assessSafety("I've been vomiting every day for 3 days")
    expect(result.isSafe).toBe(false)
  })

  test('missed period (unexpected) → caution or urgent', () => {
    const result = assessSafety("I missed my period and I wasn't expecting it")
    expect(['caution', 'urgent']).toContain(result.triageLevel)
  })
})

describe('assessSafety — SAFE queries', () => {
  test('TSH lab value question → safe', () => {
    const result = assessSafety('My TSH came back as 6.8, is that normal?')
    expect(result.triageLevel).toBe('safe')
    expect(result.isSafe).toBe(true)
    expect(result.flaggedKeywords).toHaveLength(0)
  })

  test('mild headache → safe', () => {
    const result = assessSafety('I have a mild headache today')
    expect(result.triageLevel).toBe('safe')
    expect(result.isSafe).toBe(true)
  })

  test('general medicine question → safe', () => {
    const result = assessSafety('What medicines am I taking for thyroid?')
    expect(result.triageLevel).toBe('safe')
    expect(result.isSafe).toBe(true)
  })

  test('lab value explanation request → safe', () => {
    const result = assessSafety('Can you explain what HbA1c means?')
    expect(result.triageLevel).toBe('safe')
    expect(result.isSafe).toBe(true)
  })

  test('appointment preparation → safe', () => {
    const result = assessSafety('What should I ask at my next appointment?')
    expect(result.triageLevel).toBe('safe')
    expect(result.isSafe).toBe(true)
  })
})

describe('urgentCareMessage content', () => {
  test('urgent message references Indian emergency numbers', () => {
    const result = assessSafety('I have severe chest pain')
    expect(result.urgentCareMessage).toMatch(/102|112/)
  })

  test('urgent message advises seeking immediate help', () => {
    const result = assessSafety('I cannot breathe properly')
    expect(result.urgentCareMessage).toMatch(/immediate|emergency|now/i)
  })
})

describe('getTriageCard', () => {
  test('urgent assessment returns red triage card', () => {
    const assessment = assessSafety('I have chest pain')
    const card = getTriageCard(assessment)
    if (assessment.triageLevel === 'urgent') {
      expect(card.color).toMatch(/red/)
      expect(card.action).toBeDefined()
    }
  })

  test('safe assessment returns green triage card', () => {
    const assessment = assessSafety('What does TSH mean?')
    const card = getTriageCard(assessment)
    expect(card.color).toMatch(/green/)
  })
})

describe('RED_FLAG_KEYWORDS coverage', () => {
  test('RED_FLAG_KEYWORDS has critical category with sufficient entries', () => {
    expect(RED_FLAG_KEYWORDS).toHaveProperty('critical')
    expect(Array.isArray(RED_FLAG_KEYWORDS.critical)).toBe(true)
    expect(RED_FLAG_KEYWORDS.critical.length).toBeGreaterThan(5)
  })

  test('RED_FLAG_KEYWORDS has pregnancy category', () => {
    expect(RED_FLAG_KEYWORDS).toHaveProperty('pregnancy')
  })

  test('RED_FLAG_KEYWORDS has mental health / self-harm category', () => {
    const hasMental =
      'mentalHealth' in RED_FLAG_KEYWORDS ||
      'self_harm' in RED_FLAG_KEYWORDS ||
      'selfHarm' in RED_FLAG_KEYWORDS ||
      'mental_health' in RED_FLAG_KEYWORDS
    expect(hasMental).toBe(true)
  })
})
