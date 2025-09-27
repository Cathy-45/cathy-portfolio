import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files and handle client-side routing in one middleware

app.use((req, res) => {
  // Serve static files from dist

  const filePath = path.join(__dirname, 'dist', req.path);
  if (req.path.includes('.') || req.path === '/_redirects') {

    // Serve files with extensions (e.g., .css, .js) or _redirects

    return res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('Not Found');
      }
    });
  }
  // Fallback to index.html for client-side routing


  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
