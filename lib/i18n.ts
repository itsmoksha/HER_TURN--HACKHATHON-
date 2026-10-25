/**
 * HER TURN - Internationalization (i18n) Module
 * Supports English ('en'), Hindi ('hi'), and Kannada ('kn').
 */

export type SupportedLanguage = 'en' | 'hi' | 'kn'

export interface LanguageOption {
  code: SupportedLanguage
  name: string
  nativeName: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
]

export const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.records': 'Records',
    'nav.assistant': 'AI Assistant',
    'nav.reminders': 'Reminders',
    'nav.appointments': 'Appointments',
    'nav.trustedAccess': 'Trusted Access',
    'nav.privacy': 'Privacy & Consent',
    'nav.settings': 'Settings',

    // Common UI
    'common.today': 'Today',
    'common.yesterday': 'Yesterday',
    'common.tomorrow': 'Tomorrow',
    'common.upload': 'Upload',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.done': 'Done',
    'common.loading': 'Loading...',
    'common.search': 'Search...',
    'common.filter': 'Filter',
    'common.view': 'View',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.error': 'Something went wrong',
    'common.success': 'Saved successfully',
    'common.retry': 'Retry',
    'common.add': 'Add New',
    'common.status': 'Status',
    'common.actions': 'Actions',

    // Assistant
    'assistant.placeholder': 'Ask about your symptoms, medications, or test reports...',
    'assistant.disclaimer': 'HER TURN is an AI health companion and does not replace professional medical diagnosis or clinical care.',
    'assistant.emergencyNotice': 'If you are experiencing severe pain, heavy bleeding, or difficulty breathing, call 112 immediately.',
    'assistant.askPlaceholder': 'Ask in English, Hindi, or Kannada...',
    'assistant.newChat': 'New Consultation',
    'assistant.clearHistory': 'Clear History',

    // Onboarding
    'onboarding.welcome': 'Welcome to HER TURN',
    'onboarding.tagline': 'Your health, your records, completely in your control.',
    'onboarding.step1Title': 'Designed for Women’s Health',
    'onboarding.step1Desc': 'Track menstrual cycles, symptoms, pregnancy, and chronic conditions like PCOS and Thyroid with dignity and privacy.',
    'onboarding.step2Title': 'Smart Medical Scanner',
    'onboarding.step2Desc': 'Upload doctor prescriptions and lab reports. Our AI organizes values, highlights out-of-range items, and explains them simply.',
    'onboarding.step3Title': 'Circle of Trust',
    'onboarding.step3Desc': 'Grant granular, revocable record access to trusted family members or doctors. Your data is always encrypted.',
    'onboarding.getStarted': 'Get Started',

    // Safety & Red Flags
    'safety.seekImmediateHelp': 'Seek Immediate Medical Attention',
    'safety.seekCareNowDesc': 'Your symptoms or lab values match urgent clinical warning signs. Please contact an emergency clinic or call 112 right away.',
    'safety.emergencyContacts': 'Emergency Contacts: 112 (National Emergency), 108 (Ambulance), 102 (Maternity Emergency)',
    'safety.redFlagWarning': 'Clinical Red-Flag Warning',
    'safety.triageSelfCare': 'Self-care & monitoring recommended',
    'safety.triageSeeDoctor': 'Schedule a visit with your physician',
    'safety.triageSeekCareNow': 'Emergency care required immediately',
  },

  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.records': 'चिकित्सा रिकॉर्ड',
    'nav.assistant': 'एआई स्वास्थ्य सहायक',
    'nav.reminders': 'दवा अनुस्मारक',
    'nav.appointments': 'अपॉइंटमेंट',
    'nav.trustedAccess': 'विश्वसनीय पहुंच',
    'nav.privacy': 'गोपनीयता और सहमति',
    'nav.settings': 'सेटिंग्स',

    // Common UI
    'common.today': 'आज',
    'common.yesterday': 'कल',
    'common.tomorrow': 'कल (आने वाला)',
    'common.upload': 'अपलोड करें',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.back': 'पीछे',
    'common.next': 'आगे',
    'common.done': 'पूर्ण',
    'common.loading': 'लोड हो रहा है...',
    'common.search': 'खोजें...',
    'common.filter': 'फ़िल्टर',
    'common.view': 'देखें',
    'common.confirm': 'पुष्टि करें',
    'common.close': 'बंद करें',
    'common.error': 'कुछ गड़बड़ हुई',
    'common.success': 'सफलतापूर्वक सहेजा गया',
    'common.retry': 'पुनः प्रयास करें',
    'common.add': 'नया जोड़ें',
    'common.status': 'स्थिति',
    'common.actions': 'कार्रवाई',

    // Assistant
    'assistant.placeholder': 'अपने लक्षणों, दवाओं या लैब रिपोर्ट के बारे में पूछें...',
    'assistant.disclaimer': 'HER TURN एक एआई स्वास्थ्य सहायक है और यह पेशेवर डॉक्टर के परामर्श का विकल्प नहीं है।',
    'assistant.emergencyNotice': 'यदि आपको अत्यधिक दर्द, भारी रक्तस्राव या सांस लेने में कठिनाई हो रही है, तो तुरंत 112 पर कॉल करें।',
    'assistant.askPlaceholder': 'हिंदी, अंग्रेजी या कन्नड़ में पूछें...',
    'assistant.newChat': 'नई बातचीत',
    'assistant.clearHistory': 'इतिहास हटाएं',

    // Onboarding
    'onboarding.welcome': 'HER TURN में आपका स्वागत है',
    'onboarding.tagline': 'आपका स्वास्थ्य, आपके रिकॉर्ड, पूरी तरह आपके नियंत्रण में।',
    'onboarding.step1Title': 'महिलाओं के स्वास्थ्य के लिए समर्पित',
    'onboarding.step1Desc': 'मासिक धर्म, लक्षण, गर्भावस्था और पीसीओएस या थायराइड जैसी स्थितियों को पूर्ण गोपनीयता के साथ ट्रैक करें।',
    'onboarding.step2Title': 'स्मार्ट मेडिकल स्कैनर',
    'onboarding.step2Desc': 'डॉक्टर के पर्चे और लैब टेस्ट रिपोर्ट अपलोड करें। हमारा एआई इसे सरल भाषा में समझाता है।',
    'onboarding.step3Title': 'विश्वास का दायरा',
    'onboarding.step3Desc': 'अपने परिवार या डॉक्टर को सुरक्षित रूप से रिकॉर्ड देखने की अनुमति दें। आप इसे कभी भी रद्द कर सकती हैं।',
    'onboarding.getStarted': 'शुरू करें',

    // Safety & Red Flags
    'safety.seekImmediateHelp': 'तुरंत चिकित्सकीय सहायता लें',
    'safety.seekCareNowDesc': 'आपके लक्षण आपातकालीन चेतावनी के संकेत देते हैं। कृपया तुरंत नजदीकी अस्पताल जाएं या 112 पर कॉल करें।',
    'safety.emergencyContacts': 'आपातकालीन नंबर: 112 (राष्ट्रीय आपातकाल), 108 (एम्बुलेंस), 102 (मातृत्व आपातकाल)',
    'safety.redFlagWarning': 'गंभीर स्वास्थ्य चेतावनी',
    'safety.triageSelfCare': 'घरेलू देखभाल और निगरानी की सलाह',
    'safety.triageSeeDoctor': 'डॉक्टर से परामर्श का समय तय करें',
    'safety.triageSeekCareNow': 'तुरंत आपातकालीन चिकित्सा की आवश्यकता है',
  },

  kn: {
    // Navigation
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.records': 'ಆರೋಗ್ಯ ದಾಖಲೆಗಳು',
    'nav.assistant': 'ಎಐ ಆರೋಗ್ಯ ಸಹಾಯಕ',
    'nav.reminders': 'ದವಾ ಜ್ಞಾಪನೆಗಳು',
    'nav.appointments': 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
    'nav.trustedAccess': 'ವಿಶ್ವಾಸಾರ್ಹ ಪ್ರವೇಶ',
    'nav.privacy': 'ಗೌಪ್ಯತೆ ಮತ್ತು ಒಪ್ಪಿಗೆ',
    'nav.settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',

    // Common UI
    'common.today': 'ಇಂದು',
    'common.yesterday': 'ನಿನ್ನೆ',
    'common.tomorrow': 'ನಾಳೆ',
    'common.upload': 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    'common.save': 'ಉಳಿಸಿ',
    'common.cancel': 'ರದ್ದುಮಾಡಿ',
    'common.edit': 'ತಿದ್ದಿ',
    'common.delete': 'ಅಳಿಸಿ',
    'common.back': 'ಹಿಂದೆ',
    'common.next': 'ಮುಂದೆ',
    'common.done': 'ಮುಕ್ತಾಯ',
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.search': 'ಹುಡುಕಿ...',
    'common.filter': 'ಫಿಲ್ಟರ್',
    'common.view': 'ವೀಕ್ಷಿಸಿ',
    'common.confirm': 'ಖಚಿತಪಡಿಸಿ',
    'common.close': 'ಮುಚ್ಚಿ',
    'common.error': 'ದೋಷ ಸಂಭವಿಸಿದೆ',
    'common.success': 'ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ',
    'common.retry': 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    'common.add': 'ಹೊಸದನ್ನು ಸೇರಿಸಿ',
    'common.status': 'ಸ್ಥಿತಿ',
    'common.actions': 'ಕ್ರಮಗಳು',

    // Assistant
    'assistant.placeholder': 'ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳು, ಔಷಧಿಗಳು ಅಥವಾ ವರದಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    'assistant.disclaimer': 'HER TURN ಎಐ ಆರೋಗ್ಯ ಸಹಾಯಕಿ ಮತ್ತು ಇದು ವೈದ್ಯರ ನೇರ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.',
    'assistant.emergencyNotice': 'ನಿಮಗೆ ತೀವ್ರ ನೋವು, ಅಧಿಕ ರಕ್ತಸ್ರಾವ ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಇದ್ದರೆ, ತಕ್ಷಣ 112 ಗೆ ಕರೆ ಮಾಡಿ.',
    'assistant.askPlaceholder': 'ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಹಿಂದಿಯಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ...',
    'assistant.newChat': 'ಹೊಸ ಸಂಭಾಷಣೆ',
    'assistant.clearHistory': 'ಇತಿಹಾಸ ತೆರವುಗೊಳಿಸಿ',

    // Onboarding
    'onboarding.welcome': 'HER TURN ಗೆ ಸುಸ್ವಾಗತ',
    'onboarding.tagline': 'ನಿಮ್ಮ ಆರೋಗ್ಯ, ನಿಮ್ಮ ದಾಖಲೆಗಳು, ಸಂಪೂರ್ಣವಾಗಿ ನಿಮ್ಮ ನಿಯಂತ್ರಣದಲ್ಲಿ.',
    'onboarding.step1Title': 'ಮಹಿಳೆಯರ ಆರೋಗ್ಯಕ್ಕಾಗಿ ವಿಶೇಷ ವಿನ್ಯಾಸ',
    'onboarding.step1Desc': 'ಮುಟ್ಟು, ರೋಗಲಕ್ಷಣಗಳು, ಗರ್ಭಾವಸ್ಥೆ ಮತ್ತು ಪಿಸಿಒಎಸ್/ಥೈರಾಯ್ಡ್ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಸಂಪೂರ್ಣ ಗೌಪ್ಯತೆಯಿಂದ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
    'onboarding.step2Title': 'ಸ್ಮಾರ್ಟ್ ಮೆಡಿಕಲ್ ಸ್ಕ್ಯಾನರ್',
    'onboarding.step2Desc': 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಪರೀಕ್ಷಾ ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ನಮ್ಮ ಎಐ ಅವುಗಳನ್ನು ಸರಳ ಕನ್ನಡದಲ್ಲಿ ವಿವರಿಸುತ್ತದೆ.',
    'onboarding.step3Title': 'ವಿಶ್ವಾಸದ ವಲಯ',
    'onboarding.step3Desc': 'ಕುಟುಂಬದವರು ಅಥವಾ ವೈದ್ಯರಿಗೆ ನಿರ್ದಿಷ್ಟ ದಾಖಲೆಗಳ ಪ್ರವೇಶ ನೀಡಿ. ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಹಿಂತೆಗೆದುಕೊಳ್ಳಿ.',
    'onboarding.getStarted': 'ಪ್ರಾರಂಭಿಸಿ',

    // Safety & Red Flags
    'safety.seekImmediateHelp': 'ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ನೆರವು ಪಡೆಯಿರಿ',
    'safety.seekCareNowDesc': 'ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳು ತುರ್ತು ಎಚ್ಚರಿಕೆಯ ಸಂಕೇತಗಳಾಗಿವೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ 112 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ತುರ್ತು ಚಿಕಿತ್ಸಾ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',
    'safety.emergencyContacts': 'ತುರ್ತು ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು: 112 (ರಾಷ್ಟ್ರೀಯ ತುರ್ತು), 108 (ಆಂಬ್ಯುಲೆನ್ಸ್), 102 (ತಾಯಿ ಮತ್ತು ಮಗು ಸೇವೆ)',
    'safety.redFlagWarning': 'ಗಂಭೀರ ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ',
    'safety.triageSelfCare': 'ಸ್ವಯಂ ಆರೈಕೆ ಮತ್ತು ನಿಗಾ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
    'safety.triageSeeDoctor': 'ವೈದ್ಯರ ಭೇಟಿಯ ಸಮಯವನ್ನು ನಿಗದಿಪಡಿಸಿ',
    'safety.triageSeekCareNow': 'ತಕ್ಷಣದ ತುರ್ತು ಆರೈಕೆಯ ಅಗತ್ಯವಿದೆ',
  },
} as const

export type TranslationKey = keyof typeof translations.en

/**
 * Hook-like function to get translated strings for a given language code
 * @param lang - 'en' | 'hi' | 'kn' (defaults to 'en')
 */
export function useTranslation(lang: SupportedLanguage = 'en') {
  const currentLang = translations[lang] ? lang : 'en'
  const dictionary = translations[currentLang]
  const fallbackDictionary = translations.en

  const t = (key: string, fallback?: string): string => {
    const directMatch = (dictionary as Record<string, string>)[key]
    if (directMatch !== undefined) return directMatch

    const englishMatch = (fallbackDictionary as Record<string, string>)[key]
    if (englishMatch !== undefined) return englishMatch

    return fallback ?? key
  }

  return {
    t,
    lang: currentLang,
    languages: SUPPORTED_LANGUAGES,
    isRTL: false,
  }
}
