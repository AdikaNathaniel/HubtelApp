const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log('Incoming request:', req.url);  // Debug log

    // Serve index.html for root route
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        return;
    }

    // Serve files from public directory
    if (req.url.startsWith('/public/')) {
        const filePath = path.join(__dirname, req.url);
        console.log('Attempting to serve:', filePath);  // Debug log

        fs.readFile(filePath, (err, content) => {
            if (err) {
                console.log('Error reading file:', err);  // Debug log
                res.writeHead(404);
                res.end('File not found');
                return;
            }

            // Set content type based on file extension
            const ext = path.extname(filePath);
            let contentType = 'text/plain';
            
            switch (ext) {
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
            console.log('Successfully served:', req.url);  // Debug log
        });
        return;
    }

    // Serve CSS file
    if (req.url === '/index.css') {
        fs.readFile(path.join(__dirname, 'index.css'), (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('CSS file not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
        return;
    }

    // Handle 404
    res.writeHead(404);
    res.end('Not found');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Current directory:', __dirname);
    
    // Check if public directory exists
    const publicPath = path.join(__dirname, 'public');
    fs.access(publicPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log('WARNING: public directory does not exist!');
        } else {
            // List contents of public directory
            fs.readdir(publicPath, (err, files) => {
                if (err) {
                    console.log('Error reading public directory');
                } else {
                    console.log('Contents of public directory:', files);
                }
            });
        }
    });
});