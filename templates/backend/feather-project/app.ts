import { feathers } from '@feathersjs/feathers';
import {
  koa,
  rest,
  bodyParser,
  errorHandler,
  serveStatic,
} from '@feathersjs/koa';

interface Message {
  id?: number;
  text: string;
}

type ServiceTypes = {
  messages: MessageService;
};

class MessageService {
  messages: Message[] = [];

  async find() {
    return this.messages;
  }

  async create(value: Pick<Message, 'text'>) {
    const message: Message = {
      id: this.messages.length,
      text: value.text,
    };

    this.messages.push(message);
    return message;
  }
}

const app = koa<ServiceTypes>(feathers());
app.use(serveStatic('.'));
app.use(errorHandler());
app.use(bodyParser());
app.use('messages', new MessageService());
app.configure(rest());

app
  .listen(3030)
  .then(() => console.log(`application running on localhost:3030`));

app.service('messages').create({
  text: 'Hello, World! from the server.',
});
