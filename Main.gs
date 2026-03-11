function processIncomingEmails() {
  const threads = GmailApp.search(
    'is:unread in:inbox',
    0,
    CONFIG.LIMITS.MAX_THREADS,
  );

  if (threads.length === 0) {
    console.log('✅ Inbox up to date.');
    return;
  }

  console.log(`🔄 Processing ${threads.length} emails...`);
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(
    'Reclamos',
  );

  for (let i = 0; i < threads.length; i++) {
    let thread = threads[i];
    let message = thread.getMessages().pop();

    let rawSubject = message.getSubject();
    let subject =
      rawSubject && rawSubject.trim() !== ''
        ? rawSubject
        : 'ALERT WITHOUT SUBJECT';
    let body = message.getPlainBody() || 'No content';
    let sender = message.getFrom();

    let analysisText = anonymizeText(`Subject: ${subject}\nBody: ${body}`);

    let aiResult = queryVertexAI(analysisText);
    let classification = aiResult.classification;

    console.log(
      `📧 ${sender} | Result: ${classification} | Tokens: ${aiResult.tokens}`,
    );

    if (classification === 'OTROS' || classification === 'ERROR') {
      console.log('   -> Ignorado.');
      thread.markRead();
      continue;
    }

    let currentDate = new Date();
    let ticketId =
      'TKT-' +
      Utilities.formatDate(
        currentDate,
        Session.getScriptTimeZone(),
        'yyyyMMdd-HHmmss',
      );

    let success = sendNotification(message, classification, ticketId);

    if (success) {
      sheet.appendRow([
        ticketId,
        currentDate,
        sender,
        classification,
        'PENDIENTE',
        aiResult.tokens,
      ]);
      console.log('✅ Processed successfully.');
    }

    thread.markRead();
  }
}
