import express from 'express';

const app = express();
const port = 3000;

app.get('/', (request, response) => {
  response.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
