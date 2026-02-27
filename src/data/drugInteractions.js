export const drugInteractions = {
  'aspirin': {
    conflicts: ['ibuprofen', 'warfarin', 'clopidogrel'],
    warnings: {
      'ibuprofen': {
        severity: 'high',
        message: 'Increased risk of gastrointestinal bleeding. Both drugs inhibit platelet function.',
        recommendation: 'Consider paracetamol (acetaminophen) for pain relief instead. If both needed, use under close medical supervision.'
      },
      'warfarin': {
        severity: 'critical',
        message: 'SEVERE bleeding risk - potentially life-threatening. Both drugs affect blood clotting.',
        recommendation: 'Do NOT combine without specialist supervision. Requires frequent INR monitoring if prescribed together.'
      },
      'clopidogrel': {
        severity: 'high',
        message: 'Significantly increased bleeding risk. Both are antiplatelet agents.',
        recommendation: 'Only use together under cardiologist guidance for specific conditions.'
      }
    }
  },
  'metformin': {
    conflicts: ['contrast dye', 'alcohol'],
    warnings: {
      'contrast dye': {
        severity: 'high',
        message: 'Risk of lactic acidosis when combined with iodinated contrast media.',
        recommendation: 'Stop Metformin 48 hours before CT scan with contrast. Resume after kidney function verified.'
      }
    }
  },
  'warfarin': {
    conflicts: ['aspirin', 'ibuprofen', 'vitamin k', 'clarithromycin'],
    warnings: {
      'aspirin': {
        severity: 'critical',
        message: 'Severe bleeding risk. Combination dramatically increases bleeding potential.',
        recommendation: 'Only combine under close hematologist monitoring with frequent INR checks.'
      },
      'ibuprofen': {
        severity: 'high',
        message: 'Increased bleeding risk and reduced warfarin effectiveness.',
        recommendation: 'Use paracetamol for pain. If NSAID needed, use under medical supervision with INR monitoring.'
      }
    }
  },
  'amlodipine': {
    conflicts: ['diltiazem', 'verapamil'],
    warnings: {
      'diltiazem': {
        severity: 'medium',
        message: 'Both lower blood pressure and heart rate. Risk of excessive hypotension and bradycardia.',
        recommendation: 'Monitor blood pressure closely. Dose adjustment likely needed.'
      }
    }
  },
  'atorvastatin': {
    conflicts: ['clarithromycin', 'erythromycin', 'grapefruit'],
    warnings: {
      'clarithromycin': {
        severity: 'high',
        message: 'Significantly increases statin blood levels. High risk of rhabdomyolysis (muscle breakdown).',
        recommendation: 'Use alternative antibiotic (azithromycin is safer). If clarithromycin essential, temporarily stop statin.'
      }
    }
  },
  'ibuprofen': {
    conflicts: ['aspirin', 'warfarin', 'lisinopril', 'ramipril'],
    warnings: {
      'aspirin': {
        severity: 'high',
        message: 'Increased GI bleeding risk. Ibuprofen may also reduce cardioprotective effect of aspirin.',
        recommendation: 'Use paracetamol instead. If NSAID essential, take ibuprofen at least 2 hours after aspirin.'
      },
      'lisinopril': {
        severity: 'medium',
        message: 'NSAIDs reduce effectiveness of ACE inhibitors for blood pressure control. Risk of kidney damage.',
        recommendation: 'Use paracetamol for pain. Monitor blood pressure and kidney function if combination needed.'
      }
    }
  },
  'lisinopril': {
    conflicts: ['potassium supplements', 'spironolactone', 'ibuprofen'],
    warnings: {
      'potassium supplements': {
        severity: 'high',
        message: 'ACE inhibitors cause potassium retention. Adding supplements risks dangerous hyperkalemia (high potassium).',
        recommendation: 'Avoid potassium supplements. Monitor potassium levels regularly. Use salt substitutes cautiously.'
      },
      'spironolactone': {
        severity: 'high',
        message: 'Both drugs increase potassium levels. Risk of life-threatening hyperkalemia.',
        recommendation: 'Only combine under medical supervision with frequent potassium monitoring.'
      }
    }
  },
  'ramipril': {
    conflicts: ['potassium supplements', 'spironolactone', 'ibuprofen'],
    warnings: {
      'potassium supplements': {
        severity: 'high',
        message: 'ACE inhibitors cause potassium retention. Risk of dangerous hyperkalemia.',
        recommendation: 'Avoid potassium supplements and monitor levels regularly.'
      }
    }
  }
}

export function checkInteractions(newDrug, currentMedications) {
  const newDrugLower = newDrug.toLowerCase().trim()
  const interactions = []
  
  if (!drugInteractions[newDrugLower]) {
    return []
  }
  
  currentMedications.forEach(med => {
    const medNameLower = med.name.toLowerCase().trim()
    
    if (drugInteractions[newDrugLower].conflicts.includes(medNameLower)) {
      const warning = drugInteractions[newDrugLower].warnings[medNameLower]
      if (warning) {
        interactions.push({
          drug1: newDrug,
          drug2: med.name,
          ...warning
        })
      }
    }
  })
  
  return interactions
}

