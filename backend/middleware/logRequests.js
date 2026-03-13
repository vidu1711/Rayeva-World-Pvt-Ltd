/**
 * Logs API requests (method, path, body) and response status.
 * AI prompt/response content is logged to DB via openaiService.
 */
function logRequests(req, res, next) {
  const start = Date.now();
  const logPayload = { method: req.method, path: req.path };
  if (req.body && Object.keys(req.body).length > 0) {
    logPayload.body = req.body;
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({ ...logPayload, status: res.statusCode, durationMs: duration }));
  });

  next();
}

module.exports = logRequests;
