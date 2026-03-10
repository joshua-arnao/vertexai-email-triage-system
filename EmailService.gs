function processTicketNotification(message, classification, ticketId) {
  const destination =
    classification === 'LOGISTICA'
      ? APP_CONFIG.EMAILS.LOGISTICA
      : APP_CONFIG.EMAILS.CALIDAD;

  message.forward(destination, {
    cc: APP_CONFIG.EMAILS.SUPERVISOR,
    htmlBody:
      `
      <div style="background-color: #f3f3f3; padding: 10px; border-left: 5px solid #d93025;">
        <h3>Reclamo Detectado</h3>
        <p><strong>Tipo:</strong> ${classification}</p>
        <p><strong>Ticket:</strong> ${ticketId}</p>
      </div><br>` + message.getBody(),
  });

  message
    .getThread()
    .reply(`Su caso ${ticketId} ha sido derivado a ${classification}.`);
}
