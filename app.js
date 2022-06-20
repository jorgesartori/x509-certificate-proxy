const hostname = '127.0.0.1';
const port = 3443;

const targetHostname = '127.0.0.1';
const targetPort = 8080;

const https = require('https'),
      httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

var fs = require('fs');
var options = {
    key: fs.readFileSync('client-key.pem'),
    cert: fs.readFileSync('client-cert.pem'),
    rejectUnauthorized:false,
    requestCert: true,
  };

  const server = https.createServer(options,(req, res) => {
    proxy.web(req, res, {
        target: `http://${targetHostname}:${targetPort}`,
        headers:{'x-ssl-client-cert':req.socket.getPeerCertificate(true).raw.toString('base64')},
        secure: false,
        ws: false,
        prependPath: false,
        ignorePath: false,
    });
  });
  
  server.listen(port, hostname, () => {
    console.log(`Exige certificado em https://${hostname}:${port}
Redirecionando para http://${targetHostname}:${targetPort}
com o certificado no parâmetro 'x-ssl-client-cert' do header.
Endereço do OpenApi: https://${hostname}:${port}/api/v1/index.html#/`);
  });


