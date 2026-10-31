// Reads and parses the JSON body from incoming POST/PUT requests.
// Express normally does this automatically via express.json() —
// with plain Node http, we have to read the request stream manually.

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        reject(new Error('Invalid JSON in request body'));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = { parseRequestBody };