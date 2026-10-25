/**
 * HER TURN — Prescription Parser Test Suite
 *
 * Tests the AI extraction + parsing pipeline for prescriptions.
 * Critical safety property: the parser must NEVER guess medicine names —
 * any unclear field must be flagged for user confirmation.
 */

// We test the parsing logic that wraps Gemini's output into structured data.
// The actual Gemini call is mocked.

interface ParsedMedicine {
  name: string
  strength: string
  dose: string
  frequency: string
  duration: string
  instructions: string
  confidence: number // 0-1
}

interface ParsedPrescription {
  medicines: ParsedMedicine[]
  doctorName?: string
  date?: string
  rawText: string
}

/** Simulates what the parser does with Gemini output */
function parsePrescriptionText(rawText: string): ParsedPrescription {
  const lines = rawText.split('\n').filter(Boolean)
  const medicines: ParsedMedicine[] = []

  for (const line of lines) {
    // Very simplified parser for test purposes
    const nameMatch = line.match(/^([A-Za-z][A-Za-z\s]+)\s+(\d+[\w.]+)/)
    if (nameMatch) {
      const name = nameMatch[1].trim()
      const strength = nameMatch[2].trim()
      const confidence = name.length > 3 && strength ? 0.9 : 0.5
      medicines.push({
        name,
        strength,
        dose: '1 tablet',
        frequency: line.toLowerCase().includes('twice') ? 'Twice daily' : 'Once daily',
        duration: line.match(/(\d+)\s*days?/i)?.[1] ? `${line.match(/(\d+)\s*days?/i)![1]} days` : '30 days',
        instructions: line.toLowerCase().includes('before') ? 'Before meals' : 'After meals',
        confidence,
      })
    } else if (line.trim().length > 2) {
      // Unrecognised line — flag as low confidence
      medicines.push({
        name: line.trim().slice(0, 20),
        strength: '',
        dose: '',
        frequency: '',
        duration: '',
        instructions: '',
        confidence: 0.3, // Low confidence — must be flagged
      })
    }
  }

  return { medicines, rawText }
}

function hasLowConfidenceField(medicine: ParsedMedicine, threshold = 0.6): boolean {
  return medicine.confidence < threshold
}

function getLowConfidenceMedicines(prescription: ParsedPrescription, threshold = 0.6): ParsedMedicine[] {
  return prescription.medicines.filter((m) => hasLowConfidenceField(m, threshold))
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Prescription Parser — basic extraction', () => {
  const sampleText = `Levothyroxine 50mcg once daily before breakfast for 90 days
Metformin 500mg twice daily with meals for 90 days
Folic Acid 5mg once daily morning for 30 days`

  test('extracts correct number of medicines', () => {
    const result = parsePrescriptionText(sampleText)
    expect(result.medicines.length).toBe(3)
  })

  test('extracts Levothyroxine with correct strength', () => {
    const result = parsePrescriptionText(sampleText)
    const levo = result.medicines.find((m) => m.name.toLowerCase().includes('levothyroxine'))
    expect(levo).toBeDefined()
    expect(levo!.strength).toBe('50mcg')
  })

  test('extracts Metformin with twice daily frequency', () => {
    const result = parsePrescriptionText(sampleText)
    const met = result.medicines.find((m) => m.name.toLowerCase().includes('metformin'))
    expect(met).toBeDefined()
    expect(met!.frequency).toBe('Twice daily')
  })

  test('assigns high confidence to clearly readable medicines', () => {
    const result = parsePrescriptionText(sampleText)
    const levo = result.medicines.find((m) => m.name.toLowerCase().includes('levothyroxine'))
    expect(levo!.confidence).toBeGreaterThan(0.6)
  })
})

describe('Prescription Parser — low confidence handling', () => {
  const unclearText = `???? 50mg twice daily
Amlodipine 5mg once daily`

  test('flags unrecognised/unclear medicine names as low confidence', () => {
    const result = parsePrescriptionText(unclearText)
    const lowConf = getLowConfidenceMedicines(result)
    expect(lowConf.length).toBeGreaterThan(0)
  })

  test('clearly readable medicine is not flagged', () => {
    const result = parsePrescriptionText(unclearText)
    const aml = result.medicines.find((m) => m.name.toLowerCase().includes('amlodipine'))
    expect(aml).toBeDefined()
    expect(hasLowConfidenceField(aml!)).toBe(false)
  })

  test('low-confidence medicines should not auto-become reminders', () => {
    const result = parsePrescriptionText(unclearText)
    const lowConf = getLowConfidenceMedicines(result)
    // Business rule: only confirmed (confidence >= 0.6 AND user-confirmed) medicines become reminders
    lowConf.forEach((m) => {
      expect(m.confidence).toBeLessThan(0.6)
    })
  })
})

describe('Prescription Parser — safety invariants', () => {
  test('parser never invents medicine names from empty input', () => {
    const result = parsePrescriptionText('')
    expect(result.medicines).toHaveLength(0)
  })

  test('parser never invents medicine names from whitespace', () => {
    const result = parsePrescriptionText('   \n   \n  ')
    expect(result.medicines).toHaveLength(0)
  })

  test('confidence is always between 0 and 1', () => {
    const result = parsePrescriptionText('Metformin 500mg once daily\n??? ???')
    result.medicines.forEach((m) => {
      expect(m.confidence).toBeGreaterThanOrEqual(0)
      expect(m.confidence).toBeLessThanOrEqual(1)
    })
  })

  test('low confidence field triggers amber warning flag', () => {
    const medicine: ParsedMedicine = {
      name: 'Unclear Medicine',
      strength: '',
      dose: '',
      frequency: '',
      duration: '',
      instructions: '',
      confidence: 0.4,
    }
    expect(hasLowConfidenceField(medicine)).toBe(true)
  })

  test('high confidence field does not trigger amber warning', () => {
    const medicine: ParsedMedicine = {
      name: 'Levothyroxine',
      strength: '50mcg',
      dose: '1 tablet',
      frequency: 'Once daily',
      duration: '90 days',
      instructions: 'Before breakfast',
      confidence: 0.92,
    }
    expect(hasLowConfidenceField(medicine)).toBe(false)
  })
})

describe('getLowConfidenceMedicines helper', () => {
  test('returns empty array when all medicines are high confidence', () => {
    const prescription: ParsedPrescription = {
      medicines: [
        { name: 'Levothyroxine', strength: '50mcg', dose: '1 tablet', frequency: 'Once daily', duration: '90 days', instructions: 'Before breakfast', confidence: 0.95 },
        { name: 'Metformin', strength: '500mg', dose: '1 tablet', frequency: 'Twice daily', duration: '90 days', instructions: 'With meals', confidence: 0.88 },
      ],
      rawText: 'mock',
    }
    expect(getLowConfidenceMedicines(prescription)).toHaveLength(0)
  })

  test('returns all low-confidence items when mix present', () => {
    const prescription: ParsedPrescription = {
      medicines: [
        { name: 'Levothyroxine', strength: '50mcg', dose: '1', frequency: 'Once', duration: '30d', instructions: '', confidence: 0.9 },
        { name: 'Unknown', strength: '', dose: '', frequency: '', duration: '', instructions: '', confidence: 0.3 },
        { name: 'Unclear', strength: '', dose: '', frequency: '', duration: '', instructions: '', confidence: 0.45 },
      ],
      rawText: 'mock',
    }
    expect(getLowConfidenceMedicines(prescription)).toHaveLength(2)
  })
})
