function monitorSlaDeadlines() {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(
    'Reclamos',
  );
  const data = sheet.getDataRange().getValues();
  const now = new Date();

  console.log('🕵️ Checking SLA deadlines...');

  for (let i = 1; i < data.length; i++) {
    let row = i + 1;
    let [ticketId, date, , reason, status] = data[i];

    let hoursPassed = (now - new Date(date)) / (1000 * 60 * 60);

    if (
      status === 'PENDIENTE' &&
      hoursPassed >= CONFIG.LIMITS.EXPIRATION_HOURS
    ) {
      console.log(
        `⏰ Ticket ${ticketId} is overdue (${Math.floor(hoursPassed)}h).`,
      );

      let destination =
        reason === 'LOGISTICA'
          ? CONFIG.EMAILS.LOGISTICS
          : CONFIG.EMAILS.QUALITY;

      GmailApp.sendEmail(
        destination,
        `URGENT: Ticket ${ticketId} Overdue`,
        `The ticket ${ticketId} has been pending for more than 24 hours.`,
      );

      sheet.getRange(row, 5).setValue('FOLLOW_UP_SENT');
    }
  }
}
