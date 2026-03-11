const props = PropertiesService.getScriptProperties();

const CONFIG = {
  PROJECT_ID: props.getProperty('PROJECT_ID'),
  LOCATION: 'us-central1',
  MODEL_ID: 'gemini-2.5-flash',
  SPREADSHEET_ID: props.getProperty('SPREADSHEET_ID'),

  EMAILS: {
    LOGISTICS: props.getProperty('EMAIL_LOGISTICA'),
    QUALITY: props.getProperty('EMAIL_CALIDAD'),
    SUPERVISOR: props.getProperty('EMAIL_SUPERVISOR'),
  },

  LIMITS: {
    MAX_THREADS: 5,
    MAX_PROMPT_CHARS: 1500,
    EXPIRATION_HOURS: 24,
  },
};
