function sendNotification(message, classification, ticketId) {
  const targetEmail =
    classification === 'LOGISTICA'
      ? CONFIG.EMAILS.LOGISTICS
      : CONFIG.EMAILS.QUALITY;

  try {
    message.forward(targetEmail, {
      cc: CONFIG.EMAILS.SUPERVISOR,
      htmlBody:
        `
        <div style="background-color: #f3f3f3; padding: 10px; border-left: 5px solid #d93025;">
          <h3>Complaint Detected</h3>
          <p><strong>Type:</strong> ${classification}</p>
          <p><strong>Ticket:</strong> ${ticketId}</p>
        </div><br>` + message.getBody(),
    });

    message
      .getThread()
      .reply(`Your case ${ticketId} has been forwarded to ${classification}.`);
    return true;
  } catch (e) {
    console.log('❌ Notification Error: ' + e.message);
    return false;
  }
}
