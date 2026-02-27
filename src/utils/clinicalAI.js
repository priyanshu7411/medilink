import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyC-7VE9ygyJdwEIQNIxz3DpgM-0HkZNMzY')

export async function analyzeClinicalData(patient) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const conditions = patient.conditions || []
    const allergies = patient.allergies || []
    const medications = patient.medications || []
    const notes = patient.notes || []
    
    const prompt = `Analyze this patient and provide 3-5 clinical suggestions:

Patient: ${patient.name}, Age: ${patient.age}

Conditions: ${conditions.length > 0 ? conditions.join(', ') : 'None'}

Allergies: ${allergies.length > 0 ? allergies.join(', ') : 'None'}

Medications:

${medications.length > 0 ? medications.map(m => `${m.name} ${m.dosage} - ${m.doctor || 'Unknown'}`).join('\n') : 'None'}

Recent Notes:

${notes.length > 0 ? notes.slice(0,3).map(n => `${n.doctor || 'Unknown'}: ${n.content}`).join('\n') : 'No recent notes'}

Return JSON array only:

[

  {

    "category": "LAB_TEST|MEDICATION_REVIEW|PREVENTIVE_CARE|FOLLOW_UP|RISK_ALERT",

    "title": "brief title",

    "reasoning": "why this matters",

    "action": "what to do",

    "priority": "high|medium|low"

  }

]`
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return getRuleBasedSuggestions(patient)
  } catch (error) {
    console.error('AI Error:', error)
    return getRuleBasedSuggestions(patient)
  }
}

function getRuleBasedSuggestions(patient) {
  const suggestions = []
  
  const conditions = patient.conditions || []
  const allergies = patient.allergies || []
  const medications = patient.medications || []
  const notes = patient.notes || []
  
  // Diabetes without recent HbA1c
  if (conditions.some(c => c.toLowerCase().includes('diabetes'))) {
    const hasRecentHbA1c = notes.some(n => 
      n.content && n.content.toLowerCase().includes('hba1c') && 
      n.date && (Date.now() - new Date(n.date).getTime()) < 90 * 24 * 60 * 60 * 1000
    )
    
    if (!hasRecentHbA1c) {
      suggestions.push({
        category: 'LAB_TEST',
        title: 'HbA1c test overdue for diabetic patient',
        reasoning: 'Diabetic patients need HbA1c every 3 months',
        action: 'Order HbA1c, fasting glucose, lipid profile',
        priority: 'high'
      })
    }
  }
  
  // Polypharmacy
  if (medications.length >= 4) {
    suggestions.push({
      category: 'MEDICATION_REVIEW',
      title: 'Polypharmacy detected - review needed',
      reasoning: `Patient on ${medications.length} medications - interaction risk`,
      action: 'Conduct medication review, consider deprescribing',
      priority: 'high'
    })
  }
  
  // Hypertension monitoring
  if (conditions.some(c => c.toLowerCase().includes('hypertension'))) {
    suggestions.push({
      category: 'FOLLOW_UP',
      title: 'Blood pressure monitoring required',
      reasoning: 'Regular BP monitoring needed for hypertensives',
      action: 'Schedule BP check, review antihypertensive meds',
      priority: 'medium'
    })
  }
  
  // Elderly screening
  if (patient.age >= 65) {
    suggestions.push({
      category: 'PREVENTIVE_CARE',
      title: 'Age-appropriate preventive screening',
      reasoning: 'Patients 65+ need regular health screenings',
      action: 'Order: Bone density, metabolic panel, cancer screening',
      priority: 'medium'
    })
  }
  
  // Statin liver monitoring
  if (medications.some(m => 
    m.name && (m.name.toLowerCase().includes('atorvastatin') || 
    m.name.toLowerCase().includes('statin'))
  )) {
    suggestions.push({
      category: 'LAB_TEST',
      title: 'Liver monitoring for statin therapy',
      reasoning: 'Statins require periodic liver function monitoring',
      action: 'Order LFT (SGPT, SGOT) if not done in 6 months',
      priority: 'medium'
    })
  }
  
  // Allergy warning
  if (allergies.length > 0) {
    suggestions.push({
      category: 'RISK_ALERT',
      title: `Patient has ${allergies.length} documented allergies`,
      reasoning: `Allergies: ${allergies.join(', ')}`,
      action: 'Cross-check all prescriptions against allergy list',
      priority: 'high'
    })
  }
  
  // Diabetes + Hypertension combo
  if (conditions.some(c => c.toLowerCase().includes('diabetes')) &&
      conditions.some(c => c.toLowerCase().includes('hypertension'))) {
    suggestions.push({
      category: 'RISK_ALERT',
      title: 'High cardiovascular risk profile',
      reasoning: 'Diabetes + Hypertension = elevated cardiac risk',
      action: 'Consider ECG, echo, lipid profile, cardiac assessment',
      priority: 'high'
    })
  }
  
  return suggestions
}

