const http = await import('http');
const port = 3000;
const host = 'localhost';

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.end('Hello, Node!');
});

server.listen({ port, host }, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
