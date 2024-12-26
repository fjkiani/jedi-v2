export const patientRiskAnalysisDocs = {
  title: "Patient Risk Analysis System",
  description: "AI-powered patient risk assessment and monitoring",
  
  fundamentals: {
    title: "Understanding Patient Risk Analysis",
    sections: [
      {
        title: "How Modern Patient Risk Analysis Works",
        content: "Modern patient risk analysis systems use AI to process patient data, identify patterns, and predict potential health risks. The system analyzes multiple data points while ensuring privacy and compliance.",
        detailedExplanation: `
          The patient risk analysis pipeline includes:

          1. Collection of patient health data and history
          2. AI analysis of health patterns and indicators
          3. Risk factor identification and scoring
          4. Automated alerts and recommendations
        `,
        keyPoints: [
          "🏥 Real-time health data analysis",
          "🔍 Pattern recognition in patient history",
          "⚕️ Risk factor identification",
          "🔄 Continuous monitoring and updates"
        ],
        codeExample: `
// You Imagine - Jedi Labs Engineers
(async () => {
  try {
    customConsole.log("🏥 Patient Risk Analysis System - Interactive Demo");
    customConsole.log("=============================================");
    customConsole.log("Welcome! This demo shows how AI analyzes patient data");
    customConsole.log("to identify potential health risks and recommend actions.");
    customConsole.log("");

    // Configuration
    const RISK_THRESHOLD = 0.65; // 65% confidence for risk alerts
    
    // Sample patient data
    const patientData = {
      id: "pt_789",
      age: 45,
      vitals: {
        bloodPressure: "140/90",
        heartRate: 82,
        temperature: 98.6
      },
      conditions: ["diabetes_type2"],
      medications: ["metformin"],
      lastCheckup: "2023-12-15"
    };

    customConsole.log("📋 Patient Data Received:");
    customConsole.log(patientData);
    customConsole.log("");

    // Step 1: Gather Historical Data
    customConsole.log("🔍 Step 1: Gathering Historical Data");
    customConsole.log("----------------------------------");
    customConsole.log("We'll analyze:");
    customConsole.log("• Past medical history");
    customConsole.log("• Recent test results");
    customConsole.log("• Medication adherence");
    customConsole.log("• Lifestyle factors");
    
    const enrichedData = await (async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        ...patientData,
        history: {
          pastVisits: 12,
          avgGlucose: 142,
          medicationAdherence: 0.85,
          lifestyle: {
            exercise: "moderate",
            diet: "mixed",
            smoking: "never"
          }
        }
      };
    })();

    customConsole.log("✅ Historical Data Collected!");
    customConsole.log("📊 Key Findings:");
    customConsole.log("• Regular checkups: 12 visits in past year");
    customConsole.log("• Average glucose: 142 mg/dL");
    customConsole.log("• Good medication adherence: 85%");
    customConsole.log("");

    // Step 2: Risk Factor Analysis
    customConsole.log("🧬 Step 2: Risk Factor Analysis");
    customConsole.log("--------------------------");
    customConsole.log("AI is analyzing patterns and risk factors...");

    const riskFactors = await (async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return [
        {
          factor: "elevated_bp",
          level: 0.7,
          detail: "Blood pressure (140/90) is above optimal range"
        },
        {
          factor: "glucose_management",
          level: 0.4,
          detail: "Glucose levels trending higher than target"
        }
      ];
    })();

    customConsole.log("🚨 Risk Factors Identified:");
    riskFactors.forEach(r => {
      customConsole.log(\`• \${r.detail}\`);
      customConsole.log(\`  Risk Level: \${(r.level * 100).toFixed(0)}%\`);
    });
    customConsole.log("");

    // Final Assessment
    const overallRisk = riskFactors.reduce((acc, r) => acc + r.level, 0) / riskFactors.length;
    
    customConsole.log("📋 Risk Assessment");
    customConsole.log("----------------");
    customConsole.log(\`Overall Risk Level: \${(overallRisk * 100).toFixed(0)}%\`);
    customConsole.log(\`Alert Threshold: \${(RISK_THRESHOLD * 100).toFixed(0)}%\`);
    customConsole.log("");
    
    if (overallRisk > RISK_THRESHOLD) {
      customConsole.log("⚠️ RECOMMENDATION: Schedule follow-up appointment");
      customConsole.log("Suggested actions:");
      customConsole.log("• Review blood pressure medication");
      customConsole.log("• Adjust diabetes management plan");
      customConsole.log("• Schedule cardiovascular assessment");
    } else {
      customConsole.log("✅ ASSESSMENT: Continue current management plan");
      customConsole.log("Suggested actions:");
      customConsole.log("• Maintain medication schedule");
      customConsole.log("• Regular glucose monitoring");
    }

    return {
      riskScore: overallRisk,
      needsFollowUp: overallRisk > RISK_THRESHOLD,
      riskFactors,
      patientData: enrichedData
    };

  } catch (error) {
    customConsole.error("Error in analysis:", error.message);
    return { error: error.message };
  }
})();
`
      }
    ]
  }
};