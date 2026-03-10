function getAiClassification(text) {
  if (!text) return { classification: 'ERROR', tokens: 0 };

  const url = `https://${APP_CONFIG.LOCATION}-aiplatform.googleapis.com/v1/projects/${APP_CONFIG.PROJECT_ID}/locations/${APP_CONFIG.LOCATION}/publishers/google/models/${APP_CONFIG.MODEL_ID}:generateContent`;

  const prompt = `Eres un clasificador de reclamos. Analiza: "${text.substring(0, APP_CONFIG.LIMITS.MAX_PROMPT_CHARS)}". Responde SOLO: LOGISTICA, CALIDAD o OTROS.`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0, maxOutputTokens: 10 },
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    const tokens = json.usageMetadata ? json.usageMetadata.totalTokenCount : 0;

    if (!json.candidates || json.candidates.length === 0)
      return { classification: 'ERROR', tokens };

    const rawResponse = json.candidates[0].content.parts[0].text
      .trim()
      .toUpperCase();

    if (rawResponse.includes('LOGISTICA'))
      return { classification: 'LOGISTICA', tokens };
    if (rawResponse.includes('CALIDAD'))
      return { classification: 'CALIDAD', tokens };

    return { classification: 'OTROS', tokens };
  } catch (e) {
    return { classification: 'ERROR', tokens: 0 };
  }
}
