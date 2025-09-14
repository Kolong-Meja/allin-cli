import koa from 'koa';

const app = new koa();
const port = 3000;

app.use(async (context) => {
  context.body = 'Hello, Koa!';
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
