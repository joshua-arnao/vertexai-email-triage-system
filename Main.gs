function runEmailAutomation() {
  const threads = GmailApp.search(
    'is:unread in:inbox',
    0,
    APP_CONFIG.LIMITS.MAX_THREADS,
  );
  if (threads.length === 0) return;

  const sheet = SpreadsheetApp.openById(
    APP_CONFIG.SPREADSHEET_ID,
  ).getSheetByName(APP_CONFIG.SHEET_NAME);

  threads.forEach((thread) => {
    const message = thread.getMessages().pop();
    const subject = message.getSubject() || 'ALERTA SIN ASUNTO';
    const body = message.getPlainBody() || 'Sin contenido';
    const sender = message.getFrom();

    const aiResult = getAiClassification(`Asunto: ${subject}\nCuerpo: ${body}`);

    if (
      aiResult.classification !== 'OTROS' &&
      aiResult.classification !== 'ERROR'
    ) {
      const now = new Date();
      const ticketId =
        'TKT-' +
        Utilities.formatDate(
          now,
          Session.getScriptTimeZone(),
          'yyyyMMdd-HHmmss',
        );

      processTicketNotification(message, aiResult.classification, ticketId);
      sheet.appendRow([
        ticketId,
        now,
        sender,
        aiResult.classification,
        'PENDIENTE',
        aiResult.tokens,
      ]);
    }

    thread.markRead().moveToArchive();
  });
}

function runSlaMonitor() {
  const sheet = SpreadsheetApp.openById(
    APP_CONFIG.SPREADSHEET_ID,
  ).getSheetByName(APP_CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const now = new Date();

  data.forEach((row, index) => {
    if (index === 0) return;

    const [ticketId, date, , classification, status] = row;
    const hoursElapsed = (now - new Date(date)) / (1000 * 60 * 60);

    if (
      status === 'PENDIENTE' &&
      hoursElapsed >= APP_CONFIG.LIMITS.EXPIRATION_HOURS
    ) {
      const destination =
        classification === 'LOGISTICA'
          ? APP_CONFIG.EMAILS.LOGISTICA
          : APP_CONFIG.EMAILS.CALIDAD;
      GmailApp.sendEmail(
        destination,
        `URGENTE: Ticket ${ticketId} Vencido`,
        'Revisar ticket vencido.',
      );
      sheet.getRange(index + 1, 5).setValue('INSISTENCIA_ENVIADA');
    }
  });
}
