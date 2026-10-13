/**
 * Ollama Service
 * Handles HTTP communication with the local Ollama daemon for the Gemma model.
 */

const getOllamaBaseUrl = () => {
  let url = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
  return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const getGemmaModelName = () => {
  return process.env.GEMMA_MODEL_NAME || 'gemma2:2b';
};

const getOllamaTimeoutMs = () => {
  const timeout = parseInt(process.env.OLLAMA_TIMEOUT_MS, 10);
  return Number.isInteger(timeout) && timeout > 0 ? timeout : 120000; // 2 minutes default
};

/**
 * Checks if the Ollama service is running and inspects available models.
 * @returns {Promise<{ isOnline: boolean, activeModel: string, hasActiveModel: boolean, availableModels: string[], message?: string }>}
 */
export const checkOllamaHealth = async () => {
  const baseUrl = getOllamaBaseUrl();
  const activeModel = getGemmaModelName();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for health check

    const res = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        isOnline: false,
        activeModel,
        hasActiveModel: false,
        availableModels: [],
        message: `Ollama returned HTTP ${res.status}: ${res.statusText}`
      };
    }

    const data = await res.json();
    const availableModels = Array.isArray(data.models)
      ? data.models.map((m) => m.name || m.model).filter(Boolean)
      : [];

    // Check if the requested model or variant is installed
    const hasActiveModel = availableModels.some((name) =>
      name.toLowerCase().startsWith(activeModel.toLowerCase())
    );

    return {
      isOnline: true,
      activeModel,
      hasActiveModel,
      availableModels,
      message: hasActiveModel
        ? `Ollama is running and model "${activeModel}" is available.`
        : `Ollama is running, but model "${activeModel}" was not found. Available models: [${availableModels.join(', ') || 'None'}]. Run "ollama pull ${activeModel}".`
    };
  } catch (error) {
    let message = `Cannot reach Ollama at ${baseUrl}. Ensure Ollama is installed and running.`;
    if (error.name === 'AbortError') {
      message = `Connection to Ollama at ${baseUrl} timed out.`;
    }

    return {
      isOnline: false,
      activeModel,
      hasActiveModel: false,
      availableModels: [],
      message
    };
  }
};

/**
 * Sends a structured generation request to the Gemma model via Ollama.
 * @param {string} prompt - Constructed prompt
 * @returns {Promise<Object>} Parsed JSON object from Gemma
 */
export const generateWithGemma = async (prompt) => {
  const baseUrl = getOllamaBaseUrl();
  const model = getGemmaModelName();
  const timeoutMs = getOllamaTimeoutMs();

  const payload = {
    model,
    prompt,
    stream: false,
    format: 'json', // Ollama native JSON schema enforcement
    options: {
      temperature: 0.2 // Lower temperature for structured and consistent outputs
    }
  };

  let responseText = '';

  try {
    const signal = AbortSignal.timeout(timeoutMs);

    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      if (res.status === 404) {
        const err = new Error(
          `Gemma model "${model}" is not installed in Ollama. Please run "ollama pull ${model}" or "ollama run ${model}" in your terminal.`
        );
        err.statusCode = 404;
        throw err;
      }

      const err = new Error(
        `Ollama API error (${res.status} ${res.statusText}): ${errorBody || 'Unknown error'}`
      );
      err.statusCode = res.status;
      throw err;
    }

    const data = await res.json();
    responseText = data.response;
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      const err = new Error(
        `AI inference timed out after ${Math.round(timeoutMs / 1000)} seconds. For faster results on local hardware, try a smaller model like "gemma2:2b" or increase OLLAMA_TIMEOUT_MS in .env.`
      );
      err.statusCode = 504;
      throw err;
    }

    if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      const err = new Error(
        `Cannot connect to Ollama daemon at ${baseUrl}. Please make sure Ollama is installed and running (run "ollama serve" in your terminal).`
      );
      err.statusCode = 503;
      throw err;
    }

    // Re-throw if already formatted
    throw error;
  }

  // Parse and extract the JSON payload
  if (!responseText || typeof responseText !== 'string') {
    const err = new Error('Gemma returned an empty response.');
    err.statusCode = 502;
    throw err;
  }

  try {
    // Strip possible markdown fences like ```json ... ```
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    return JSON.parse(cleanJson);
  } catch (parseError) {
    const err = new Error(
      `Failed to parse Gemma output as JSON: ${parseError.message}. Raw output: ${responseText.slice(0, 300)}...`
    );
    err.statusCode = 502;
    err.rawResponse = responseText;
    throw err;
  }
};
