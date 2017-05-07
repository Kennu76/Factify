var https = require('https'),
    fs = require('fs'),
    utillib = require('util');

var options = {
    key: fs.readFileSync('./certs/server/server.key'),
    cert: fs.readFileSync('./certs/server/server.crt'),
    ca: [
        fs.readFileSync('./certs/EE_Certification_Centre_Root_CA.pem.crt'),
        fs.readFileSync('./certs/ESTEID-SK_2011.pem.crt'),
        fs.readFileSync('./certs/ESTEID-SK_2015.pem.crt'),
        fs.readFileSync('./certs/ESTEID-SK_2007.pem.crt'),
        fs.readFileSync('./certs/Juur-SK.pem.crt')
    ],
    requestCert: true,
    rejectUnauthorized: true
};

https.createServer(options, function (req, res) {
    console.log('test');
    res.setHeader("Content-type","text/plain; charset=utf-8");
    res.writeHead(200);
    res.end(utillib.inspect(req.connection.getPeerCertificate()));
    console.log('test');
}).listen(443);