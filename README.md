# HER TURN – AI-Powered Women's Healthcare Companion

An AI-integrated healthcare companion designed to empower women to better understand and manage their health. HER TURN brings medical records, AI-powered document understanding, medicine reminders, appointment tracking, and consent-based information sharing into one platform.

> **Our mission:** Help women prioritize their own health by making healthcare information easier to understand, organize, and manage.

## Problem Statement

Women often prioritize the healthcare needs of their families while neglecting their own health. Busy schedules, family responsibilities, financial constraints, and a lack of awareness can cause health concerns to go unaddressed until they become serious.

Common challenges include:

- **Delayed Care:** Checkups, treatments, and follow-ups are postponed or missed.
- **Scattered Medical Records:** Prescriptions, lab reports, scans, and test results are stored across paper files, phone galleries, and messaging applications.
- **Difficult-to-Understand Reports:** Complex medical terminology makes it difficult to understand personal health information.
- **Missed Medicines and Appointments:** Medication schedules and follow-up visits can be forgotten.
- **Uncertainty About Seeking Care:** Users may struggle to recognize when a symptom requires professional assessment.
- **Limited Information-Sharing Control:** Sharing complete medical histories with family members may not always be comfortable or appropriate.

## Proposed Solution

HER TURN provides a centralized digital healthcare platform where users can upload medical documents, understand their health information with AI assistance, manage reminders, and selectively share records with trusted individuals.

The platform uses a user's uploaded medical records as context for relevant AI-assisted explanations, helping make healthcare information more accessible and understandable.

## Key Features

- **Centralized Medical Records:** Upload and organize prescriptions, laboratory reports, scans, test results, and discharge summaries in one place.
- **AI Health Assistant:** Ask health-related questions, understand medical terminology, and receive explanations grounded in available personal medical records.
- **Prescription Understanding:** Use AI-assisted text extraction to interpret prescription information. Unclear medicine names or dosages are flagged for confirmation rather than guessed.
- **Medicine Reminders and Alerts:** Set reminders using confirmed prescription instructions and receive notifications on the device.
- **Appointment and Follow-up Tracking:** Record medical appointments, schedule reminders, and keep track of follow-up visits and checkups.
- **Trusted Person Access:** Share selected medical records, reminders, and appointment information with a parent, child, spouse, or trusted friend, with the ability to change or revoke access.
- **Privacy and User Control:** Support consent-based access, notification preferences, and controls for protecting sensitive health information.
- **Healthcare Guidance and Discovery:** Provide general self-care information, highlight urgent warning signs, explain when professional assessment may be needed, and help users discover nearby hospitals, clinics, and specialists.

## AI Integration Workflow

1. **Upload:** The user uploads a prescription, laboratory report, or other medical document.
2. **Extract:** AI-assisted document processing extracts relevant text and information.
3. **Store:** The original document and its extracted information are organized in the user's private medical records.
4. **Ask:** The user asks a question, and the AI uses relevant available medical records as context to provide an explanation in simple language.
5. **Remind:** Confirmed medicine and appointment details can be used to create reminders and alerts when the user chooses.

## AI Safety and Responsible Healthcare

HER TURN is designed to support healthcare understanding rather than replace professional medical care.

- The AI does not provide definitive medical diagnoses or prescribe medicines.
- Unclear prescription details are flagged for confirmation by a qualified doctor or pharmacist.
- AI responses should acknowledge uncertainty rather than invent missing information.
- Urgent warning signs prompt users to seek appropriate medical care.
- Access to personal medical information should be based on user consent and appropriate security controls.

## Prerequisites

Before running the project locally, install the following tools:

1. **Node.js (LTS):** [https://nodejs.org/en/download](https://nodejs.org/en/download)
2. **Git:** [https://git-scm.com/downloads](https://git-scm.com/downloads)
3. **Python:** [https://www.python.org/downloads/](https://www.python.org/downloads/) *(if required by the backend)*
4. **Ollama:** [https://ollama.com/download](https://ollama.com/download) *(if using a locally hosted language model)*

> The exact requirements depend on the frontend, backend, and AI services configured in the project.

##

## Running the Project

Start the development server:

```bash
npm run dev
```

The Vite application will usually be available at:

```text
http://localhost:3000

```

Keep the terminal running while using the application.

### Backend Setup (If Applicable)

If the project includes a Python backend, open another terminal in the backend directory.

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the backend using the actual module and application name configured in your project. For example, for a FastAPI application defined as `app` in `main.py`:

```bash
uvicorn main:app --reload
```

The backend will typically run at:

```text
http://localhost:8000
```

If the project uses Ollama, ensure that the service is running and that the configured model has been downloaded before using AI features.

## Prototype Screenshots

**Home Page**

 <img width="1917" height="1077" alt="Screenshot 2026-10-25 230446" src="https://github.com/user-attachments/assets/2801c481-509a-4c86-ac6a-c115a88d264e" />

**Health Dashboard **

<img width="1916" height="868" alt="Screenshot 2026-10-25 230609" src="https://github.com/user-attachments/assets/0dde852d-c412-4f7e-9678-cc67c4babbb0" />

**AI Health Assistant**

<img width="1917" height="866" alt="Screenshot 2026-10-25 230640" src="https://github.com/user-attachments/assets/f27a8602-5c84-4725-a5c0-ea37f9524ffa" />

**Medical Records**

<img width="1915" height="1077" alt="Screenshot 2026-10-25 230721" src="https://github.com/user-attachments/assets/6ae0f24b-0346-4d10-82f9-15154e9c5eea" />

**Prescription Understanding**

|<img width="1910" height="1078" alt="Screenshot 2026-10-25 230805" src="https://github.com/user-attachments/assets/5858d04b-45bb-42a6-b73a-4404708af657" />

**Reminders and Appointments** 

<img width="1917" height="1078" alt="Screenshot 2026-10-25 230829" src="https://github.com/user-attachments/assets/d683273b-ab9d-4ce1-b8bc-dd7aebfcfc5a" />|

>

## Project Structure

```text
HER_TURN--HACKHATHON-/
├── app/                        # Main Application (Next.js 14 App Router)
│   ├── (app)/                  
│   │   ├── appointments/       
│   │   ├── assistant/          
│   │   ├── dashboard/          
│   │   ├── guidance/          
│   │   ├── privacy/            
│   │   ├── records/            
│   │   ├── reminders/          
│   │   ├── trusted/            
│   │   └── women/           
│   │
│   ├── (auth)/                 # User authentication (Login, Signup, Onboarding)
│   ├── api/                   
│   └── demo/                   
│
├── components/                 # Reusable UI Components
│   ├── dashboard/              
│   ├── records/               
│   ├── providers/              
│   ├── shared/                 
│   └── ui/                     
│
├── lib/                        # Business Logic, AI & Database Utilities
│   ├── ai/                     
│   └── db/                     
│
├── supabase/                   # Database schemas (PostgreSQL tables & RLS policies)
├── public/                     # Static media, icons & assets
└── tests/                      

```

## Tech Stack

- **Frontend:** React, Vite, TypeScript
- **AI Integration:** AI-powered document understanding and contextual health assistance
- **Backend:** Update with the framework used in the implementation
- **Database and Storage:** Update with the configured database and file-storage solution
- **Deployment:** Vercel for the frontend

## Deployment

The frontend is deployed using Vercel.

- **Live Application:** [https://her-turn-hackhathon.vercel.app/](https://her-turn-hackhathon.vercel.app/)
- **Deployment Platform:** [https://vercel.com/](https://vercel.com/)

Configure the required environment variables in the Vercel project settings. If the AI assistant depends on a separate backend or a locally hosted model, ensure that the production frontend points to an appropriately deployed and secured backend. A Vercel frontend cannot directly access an Ollama service running on a developer's local machine.

