function queryVertexAI(text) {
  if (!text) text = 'Empty text';

  const url = `https://${CONFIG.LOCATION}-aiplatform.googleapis.com/v1/projects/${CONFIG.PROJECT_ID}/locations/${CONFIG.LOCATION}/publishers/google/models/${CONFIG.MODEL_ID}:generateContent`;

  const prompt = `
    Eres un clasificador de reclamos.
    Analiza: "${text.substring(0, 1500)}"
    Responde SOLO con una de estas palabras:
    - LOGISTICA (demoras, no llega, chofer)
    - CALIDAD (roto, vencido, mal estado)
    - OTROS (spam, saludos, no es reclamo)
  `;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
    generationConfig: { temperature: 0, maxOutputTokens: 8192 },
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  let actualTokens = 0;

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());

    if (json.usageMetadata) actualTokens = json.usageMetadata.totalTokenCount;

    if (!json.candidates || json.candidates.length === 0) {
      console.log('⚠️ Vertex Error: ' + JSON.stringify(json));
      return { classification: 'ERROR', tokens: actualTokens };
    }

    const candidate = json.candidates[0];
    let responseText = '';
    if (candidate.content && candidate.content.parts) {
      responseText = candidate.content.parts[0].text;
    }

    let result = responseText.trim().toUpperCase();

    if (result.includes('LOGISTICA'))
      return { classification: 'LOGISTICA', tokens: actualTokens };
    if (result.includes('CALIDAD'))
      return { classification: 'CALIDAD', tokens: actualTokens };

    return { classification: 'OTROS', tokens: actualTokens };
  } catch (e) {
    console.log('🔥 Exception: ' + e);
    return { classification: 'ERROR', tokens: actualTokens };
  }
}
