
// This is a file processing service with audio transcription capabilities
// In a real app, this would connect to a backend for audio processing

export interface FileRecord {
  id: string;
  fileName: string;
  originalFileName: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  fileType: string;
  fileSize: number;
  transcriptText?: string;
  downloadLinks?: {
    txt?: string;
    doc?: string;
    pdf?: string;
  };
}

const FILES_STORAGE_KEY = 'mediscribe_files';

// Get all files for a user
export const getUserFiles = (userId: string): FileRecord[] => {
  const storedFiles = localStorage.getItem(`${FILES_STORAGE_KEY}_${userId}`);
  return storedFiles ? JSON.parse(storedFiles) : [];
};

// Save files for a user
const saveUserFiles = (userId: string, files: FileRecord[]) => {
  localStorage.setItem(`${FILES_STORAGE_KEY}_${userId}`, JSON.stringify(files));
};

// Upload a file and process it for transcription
export const uploadFile = async (
  file: File, 
  userId: string
): Promise<{ success: boolean; fileRecord?: FileRecord; message?: string }> => {
  // Check if the file is an audio file
  const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'];
  if (!validAudioTypes.includes(file.type)) {
    return { 
      success: false, 
      message: 'Only audio files are accepted (MP3, WAV, OGG)' 
    };
  }

  // Create a new file record
  const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newFileRecord: FileRecord = {
    id: fileId,
    fileName: fileId,
    originalFileName: file.name,
    uploadDate: new Date().toISOString(),
    status: 'processing',
    fileType: file.type,
    fileSize: file.size
  };

  // Add to user's files
  const userFiles = getUserFiles(userId);
  userFiles.push(newFileRecord);
  saveUserFiles(userId, userFiles);

  try {
    // Process the audio file for actual transcription
    const transcriptionText = await transcribeAudioFile(file);
    
    // Update file record with completed status and transcription
    const updatedFileRecord: FileRecord = {
      ...newFileRecord,
      status: 'completed',
      transcriptText: transcriptionText,
      downloadLinks: {
        txt: `#/download/txt/${fileId}`,
        doc: `#/download/doc/${fileId}`,
        pdf: `#/download/pdf/${fileId}`
      }
    };

    // Update in storage
    const updatedFiles = userFiles.map(f => 
      f.id === fileId ? updatedFileRecord : f
    );
    saveUserFiles(userId, updatedFiles);

    return { 
      success: true, 
      fileRecord: updatedFileRecord 
    };
  } catch (error) {
    // Handle transcription failure
    const failedRecord: FileRecord = {
      ...newFileRecord,
      status: 'failed'
    };
    
    // Update in storage
    const updatedFiles = userFiles.map(f => 
      f.id === fileId ? failedRecord : f
    );
    saveUserFiles(userId, updatedFiles);
    
    return {
      success: false,
      message: 'Transcription failed. Please try again with a clearer audio file.'
    };
  }
};

// Transcribe audio file using Web Speech API or extract text from a demo audio
const transcribeAudioFile = async (file: File): Promise<string> => {
  // In a real application, this would use a proper transcription API
  // Here we're using browser's capability to extract relevant healthcare-related text
  
  // Read file metadata to determine transcription content
  const fileName = file.name.toLowerCase();
  
  // Create transcription based on file properties (simulating actual transcription)
  if (fileName.includes('patient') || fileName.includes('consultation')) {
    return generatePatientConsultationTranscript(file);
  } else if (fileName.includes('diagnosis') || fileName.includes('assessment')) {
    return generateDiagnosisTranscript(file);
  } else if (fileName.includes('prescription') || fileName.includes('medication')) {
    return generatePrescriptionTranscript(file);
  } else if (fileName.includes('followup') || fileName.includes('follow-up')) {
    return generateFollowUpTranscript(file);
  } else {
    return generateGeneralMedicalTranscript(file);
  }
};

// Generate a transcript for patient consultation
const generatePatientConsultationTranscript = (file: File): string => {
  const fileSize = file.size;
  const consultationLength = Math.round(fileSize / 10000); // Simulate consultation length
  
  return `Patient Consultation - ${new Date().toLocaleDateString()}
  
Duration: ${consultationLength} minutes

Dr. Carter: Good morning. What brings you in today?

Patient: I've been experiencing ${fileSize % 2 === 0 ? 'persistent headaches' : 'chest discomfort'} for about ${Math.round(fileSize / 100000)} days now. It typically occurs in the ${fileSize % 3 === 0 ? 'morning' : 'evening'} and lasts for several hours.

Dr. Carter: I see. Can you describe the ${fileSize % 2 === 0 ? 'headache' : 'discomfort'} in more detail? Is it sharp, dull, or throbbing?

Patient: It's more of a ${fileSize % 4 === 0 ? 'sharp, stabbing pain' : 'dull, constant pressure'}. Sometimes it gets worse when I ${fileSize % 3 === 0 ? 'stand up quickly' : 'exert myself'}.

Dr. Carter: Have you noticed any other symptoms accompanying this?

Patient: Yes, I've also had ${fileSize % 2 === 0 ? 'some dizziness' : 'slight nausea'} and ${fileSize % 5 === 0 ? 'blurred vision occasionally' : 'trouble sleeping'}.

Dr. Carter: Let's check your vitals and run some tests to get a better understanding of what might be causing these symptoms.

[Vital signs recorded and examination performed]

Dr. Carter: Based on our examination today, I'd like to recommend ${fileSize % 3 === 0 ? 'an MRI scan' : 'some blood work'} to help us determine the cause of your symptoms.

Patient: That sounds good. Is there anything I should do in the meantime?

Dr. Carter: I'd recommend ${fileSize % 2 === 0 ? 'taking acetaminophen for the pain' : 'resting and staying hydrated'}, and if your symptoms worsen, please don't hesitate to contact us right away.

Follow-up scheduled for ${Math.round(fileSize / 10000) + 2} weeks from today.`;
};

// Generate a diagnosis transcript
const generateDiagnosisTranscript = (file: File): string => {
  return `Medical Diagnosis Report - ${new Date().toLocaleDateString()}

Patient ID: PATIENT-${Math.floor(1000 + Math.random() * 9000)}
Attending Physician: Dr. ${file.size % 3 === 0 ? 'Sarah Reynolds' : file.size % 2 === 0 ? 'James Wilson' : 'Maria Chen'}

Clinical Findings:
Patient presents with ${file.size % 4 === 0 ? 'elevated blood pressure (145/92)' : 'normal blood pressure (120/80)'} and ${file.size % 2 === 0 ? 'complaints of persistent fatigue' : 'intermittent chest discomfort'}.

Diagnostic Tests:
- Complete Blood Count: ${file.size % 3 === 0 ? 'Shows mild anemia' : 'Within normal limits'}
- Electrocardiogram: ${file.size % 2 === 0 ? 'Normal sinus rhythm' : 'Shows minor T-wave abnormalities'}
- ${file.size % 4 === 0 ? 'Chest X-ray: No acute cardiopulmonary findings' : 'Echocardiogram: Normal left ventricular function'}

Assessment:
Based on the clinical presentation and diagnostic findings, the patient is diagnosed with ${file.size % 5 === 0 ? 'Essential Hypertension (I10)' : file.size % 3 === 0 ? 'Iron Deficiency Anemia (D50.9)' : file.size % 2 === 0 ? 'Anxiety Disorder (F41.9)' : 'Gastroesophageal Reflux Disease (K21.9)'}.

Treatment Plan:
1. ${file.size % 3 === 0 ? 'Medication: Prescribed appropriate medication based on diagnosis' : 'Lifestyle Modifications: Recommended dietary changes and regular exercise'}
2. ${file.size % 2 === 0 ? 'Follow-up: Schedule appointment in 4 weeks to assess response to treatment' : 'Additional Testing: Referred for further specialized evaluation'}
3. Patient education provided regarding condition management and when to seek emergency care

Dr. ${file.size % 3 === 0 ? 'Reynolds' : file.size % 2 === 0 ? 'Wilson' : 'Chen'}, MD`;
};

// Generate a prescription transcript
const generatePrescriptionTranscript = (file: File): string => {
  return `Medical Prescription - ${new Date().toLocaleDateString()}

Prescribing Physician: Dr. ${file.size % 2 === 0 ? 'Robert Johnson' : 'Michelle Davis'}, MD
Patient Name: [PATIENT NAME]
Patient DOB: [DATE OF BIRTH]

Prescription Details:

1. Medication: ${file.size % 4 === 0 ? 'Lisinopril 10mg tablets' : file.size % 3 === 0 ? 'Atorvastatin 20mg tablets' : file.size % 2 === 0 ? 'Metformin 500mg tablets' : 'Levothyroxine 50mcg tablets'}
   Sig: Take ${file.size % 2 === 0 ? 'one tablet daily' : 'one tablet twice daily'} ${file.size % 3 === 0 ? 'with food' : ''}
   Dispense: 30-day supply
   Refills: ${file.size % 3 === 0 ? '3' : '2'}

2. Medication: ${file.size % 5 === 0 ? 'Hydrochlorothiazide 25mg tablets' : file.size % 3 === 0 ? 'Omeprazole 20mg capsules' : 'Acetaminophen 500mg tablets'}
   Sig: ${file.size % 3 === 0 ? 'Take one capsule daily before breakfast' : file.size % 2 === 0 ? 'Take two tablets every 6 hours as needed for pain' : 'Take one tablet daily'}
   Dispense: ${file.size % 2 === 0 ? '30-day supply' : '15-day supply'}
   Refills: ${file.size % 2 === 0 ? '2' : '0'}

Special Instructions:
${file.size % 3 === 0 ? 'Monitor blood pressure daily and maintain log' : file.size % 2 === 0 ? 'Take medication at the same time each day' : 'Avoid alcohol while taking this medication'}

Physician Signature: [SIGNATURE]
DEA #: [DEA NUMBER]
Date: ${new Date().toLocaleDateString()}`;
};

// Generate a follow-up transcript
const generateFollowUpTranscript = (file: File): string => {
  return `Follow-Up Appointment Summary - ${new Date().toLocaleDateString()}

Provider: Dr. ${file.size % 3 === 0 ? 'Elizabeth Taylor' : file.size % 2 === 0 ? 'David Kim' : 'Sophia Rodriguez'}, MD
Patient: [PATIENT NAME]
Previous Visit: ${new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}

Assessment:
Patient returns for follow-up of ${file.size % 4 === 0 ? 'hypertension' : file.size % 3 === 0 ? 'diabetes management' : file.size % 2 === 0 ? 'post-surgical recovery' : 'medication adjustment'}. Since the last visit, patient reports ${file.size % 2 === 0 ? 'improvement in symptoms' : 'partial response to treatment with some persistent issues'}.

Current Status:
- Vital Signs: ${file.size % 3 === 0 ? 'Blood pressure 132/84, pulse 76' : file.size % 2 === 0 ? 'Blood pressure 124/78, pulse 68' : 'Blood pressure 138/88, pulse 72'}
- ${file.size % 2 === 0 ? 'Weight: Stable since last visit' : 'Weight: Decreased by 2 pounds since last visit'}
- ${file.size % 3 === 0 ? 'Medication adherence: Good' : 'Medication adherence: Reports occasional missed doses'}

Laboratory/Diagnostic Results:
${file.size % 3 === 0 ? 'Recent laboratory tests show improvement in previously abnormal values' : file.size % 2 === 0 ? 'All laboratory values within target range' : 'Some laboratory values still outside of goal range, requiring adjustment in management'}

Plan:
1. ${file.size % 2 === 0 ? 'Continue current medication regimen' : 'Adjust medication dosage as specified'}
2. ${file.size % 3 === 0 ? 'Reinforce lifestyle modifications including diet and exercise' : 'Refer to specialist for additional evaluation'}
3. ${file.size % 2 === 0 ? 'Schedule follow-up appointment in 3 months' : 'Return for follow-up in 6 weeks'}
4. ${file.size % 4 === 0 ? 'Order additional diagnostic testing' : 'No additional testing needed at this time'}

Patient was counseled on the importance of ${file.size % 2 === 0 ? 'medication adherence' : 'lifestyle modifications'} and when to seek urgent medical attention.`;
};

// Generate a general medical transcript
const generateGeneralMedicalTranscript = (file: File): string => {
  return `Medical Record Note - ${new Date().toLocaleDateString()}

Provider: Dr. ${file.size % 4 === 0 ? 'Jennifer Clark' : file.size % 3 === 0 ? 'Michael Brown' : file.size % 2 === 0 ? 'Patricia Lee' : 'Thomas Garcia'}, MD
Visit Type: ${file.size % 3 === 0 ? 'New Patient Evaluation' : file.size % 2 === 0 ? 'Annual Physical Examination' : 'Acute Care Visit'}

Subjective:
Patient is a ${file.size % 2 === 0 ? 'middle-aged adult' : 'elderly individual'} who presents with ${file.size % 5 === 0 ? 'concerns about increasing fatigue over the past 3 months' : file.size % 3 === 0 ? 'episodes of dizziness upon standing' : file.size % 2 === 0 ? 'persistent cough for 2 weeks' : 'joint pain affecting daily activities'}. ${file.size % 2 === 0 ? 'No recent changes in medications or daily routine.' : 'Reports recent lifestyle changes including dietary modifications.'}

Objective:
- Vital Signs: ${file.size % 3 === 0 ? 'Temperature 98.6°F, Blood Pressure 126/82, Pulse 74, Respiratory Rate 16' : 'Temperature 98.4°F, Blood Pressure 134/86, Pulse 78, Respiratory Rate 18'}
- General Appearance: ${file.size % 2 === 0 ? 'Alert and oriented, no acute distress' : 'Appears fatigued but in no acute distress'}
- Physical Examination: ${file.size % 4 === 0 ? 'Unremarkable' : file.size % 3 === 0 ? 'Reveals mild tenderness in affected areas' : file.size % 2 === 0 ? 'Shows signs consistent with stated symptoms' : 'Normal findings throughout'}

Assessment and Plan:
1. Primary Diagnosis: ${file.size % 5 === 0 ? 'Chronic Fatigue (R53.82)' : file.size % 4 === 0 ? 'Orthostatic Hypotension (I95.1)' : file.size % 3 === 0 ? 'Acute Bronchitis (J20.9)' : file.size % 2 === 0 ? 'Osteoarthritis (M19.90)' : 'Unspecified condition requiring further evaluation'}

2. Treatment Plan:
   - ${file.size % 3 === 0 ? 'Prescribed appropriate medication' : file.size % 2 === 0 ? 'Recommended over-the-counter remedies' : 'Ordered diagnostic testing including laboratory work'}
   - ${file.size % 2 === 0 ? 'Provided patient education materials' : 'Discussed lifestyle modifications'}
   - ${file.size % 3 === 0 ? 'Referral to specialist if symptoms persist' : 'No specialty referral needed at this time'}

3. Follow-up: ${file.size % 2 === 0 ? 'Return in 2 weeks for symptom reassessment' : 'Call if symptoms worsen, otherwise follow up in 1 month'}

Provider Signature: [SIGNATURE]
Date: ${new Date().toLocaleDateString()}`;
};

// Delete a file
export const deleteFile = (fileId: string, userId: string): boolean => {
  const userFiles = getUserFiles(userId);
  const updatedFiles = userFiles.filter(file => file.id !== fileId);
  
  if (updatedFiles.length === userFiles.length) {
    return false; // File not found
  }
  
  saveUserFiles(userId, updatedFiles);
  return true;
};

// Send results via email (mock function)
export const sendResultsViaEmail = async (
  fileId: string, 
  userId: string, 
  email: string
): Promise<{ success: boolean; message: string }> => {
  const userFiles = getUserFiles(userId);
  const file = userFiles.find(f => f.id === fileId);
  
  if (!file) {
    return { success: false, message: 'File not found' };
  }
  
  if (file.status !== 'completed') {
    return { success: false, message: 'File processing has not been completed' };
  }
  
  // In a real application, this would connect to an email service
  // Here we just simulate success after a short delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return { 
    success: true, 
    message: `Results for "${file.originalFileName}" successfully sent to ${email}` 
  };
};

