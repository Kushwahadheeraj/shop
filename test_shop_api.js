
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/category-banner?category=Adhesives',
  method: 'GET',
};

console.log(`Requesting http://localhost:3000/api/category-banner?category=Adhesives`);

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`BODY: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
