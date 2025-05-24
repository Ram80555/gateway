const fs = require('fs');
const path = require('path');

const authFile = path.join(__dirname, '../auth.txt');
const credentials = {};

fs.readFileSync(authFile, 'utf-8').split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        credentials[key.trim()] = value.trim().replace(/^"|"$/g, '');
    }
});

function basicAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Authentication required.');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentialsDecoded = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentialsDecoded.split(':');

    if (username === credentials.user && password === credentials.pass) {
        return next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Invalid credentials.');
    }
}

module.exports = basicAuth;