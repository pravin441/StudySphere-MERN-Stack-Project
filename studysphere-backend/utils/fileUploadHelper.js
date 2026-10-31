// Manually parses multipart/form-data requests (file uploads) since
// we don't have Multer/Express. Extracts both file data and any
// accompanying text fields (like comments, assignmentId, studentId).
//
// This is intentionally simple — handles ONE file + a few text fields,
// which is all StudySphere's Submit Assignment page needs.

const fs = require('fs');
const path = require('path');

function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)$/);

    if (!boundaryMatch) {
      reject(new Error('No boundary found in Content-Type header.'));
      return;
    }

    const boundary = '--' + boundaryMatch[1];
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        const parts = splitBuffer(buffer, Buffer.from(boundary));

        const fields = {};
        let fileInfo = null;

        for (const part of parts) {
          if (part.length === 0) continue;

          const headerEndIndex = part.indexOf('\r\n\r\n');
          if (headerEndIndex === -1) continue;

          const headerText = part.slice(0, headerEndIndex).toString();
          const body = part.slice(headerEndIndex + 4, part.length - 2); // strip trailing \r\n

          const nameMatch = headerText.match(/name="([^"]+)"/);
          const filenameMatch = headerText.match(/filename="([^"]+)"/);

          if (!nameMatch) continue;

          if (filenameMatch) {
            // This part is a file
            const originalName = filenameMatch[1];
            const ext = path.extname(originalName);
            const savedName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const savePath = path.join(__dirname, '..', 'uploads', savedName);

            fs.writeFileSync(savePath, body);

            fileInfo = {
              fieldName: nameMatch[1],
              originalName,
              savedName,
              path: `/uploads/${savedName}`,
              size: body.length,
            };
          } else {
            // This part is a regular text field
            fields[nameMatch[1]] = body.toString().trim();
          }
        }

        resolve({ fields, file: fileInfo });
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

// Splits the raw buffer into parts using the multipart boundary
function splitBuffer(buffer, boundaryBuffer) {
  const parts = [];
  let start = buffer.indexOf(boundaryBuffer);

  while (start !== -1) {
    const nextStart = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length);
    if (nextStart === -1) break;

    // Slice out the part between this boundary and the next,
    // trimming the leading \r\n after the boundary line
    const partStart = start + boundaryBuffer.length + 2;
    const part = buffer.slice(partStart, nextStart);
    parts.push(part);

    start = nextStart;
  }

  return parts;
}

module.exports = { parseMultipartForm };