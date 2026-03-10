const APP_CONFIG = Object.freeze({
  PROJECT_ID: 'pe-pocs-ia-gen',
  LOCATION: 'us-central1',
  MODEL_ID: 'gemini-2.5-flash',
  SPREADSHEET_ID: '<SPREADSHEET_ID>',
  SHEET_NAME: 'Reclamos',
  EMAILS: {
    LOGISTICA: 'persona1@correo.com',
    CALIDAD: 'persona2@correo.com',
    SUPERVISOR: 'persona3@correo.com',
  },
  LIMITS: {
    MAX_THREADS: 5,
    MAX_PROMPT_CHARS: 1500,
    EXPIRATION_HOURS: 24,
  },
});
