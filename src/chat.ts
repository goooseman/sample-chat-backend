import * as express from 'express';
import * as socketIo from 'socket.io';
import { createServer, Server } from 'http';
import * as cors from "cors";

export enum ChatEvent {
  MESSAGE = 'message',
  LIST_MESSAGES = 'listMessages'
};

type SocketDefaultResult = "ok";
type SocketDefaultError = string;
type SocketResponse<
  Res = SocketDefaultResult,
  Err = SocketDefaultError
> = {
  res?: Res;
  err?: Err;
};

type SocketCallback<
  Res = SocketDefaultResult,
  Err = SocketDefaultError
> = (res: SocketResponse<Res, Err>) => void;


interface ChatMessageIncoming {
  id: string;
  userId: string;
  text: string;
  username: string;
}

interface ChatMessage extends ChatMessageIncoming {
  createdAt: Date;
  status: "receivedByServer";
}

interface ListMessagesResponse {
  items: ChatMessage[];
}

const chatMessages: ChatMessage[] = [];

export class ChatServer {
  public static readonly PORT: number = 8090;
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor () {
    this._app = express();
    this.port = process.env.PORT || ChatServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
  }

  private initSocket (): void {
    this.io = socketIo(this.server, { path: '/chat' });
  }

  private listen (): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on("connect", (socket: socketIo.Socket) => {
      console.log('Connected client on port %s.', this.port);

      socket.on(ChatEvent.MESSAGE, (m: ChatMessageIncoming) => {
        console.log('[server](message): %s', JSON.stringify(m));
        const savedMessage: ChatMessage = {
          ...m,
          createdAt: new Date(),
          status: "receivedByServer"
        }
        chatMessages.push(savedMessage);
        this.io.emit('message', savedMessage);
      });

      socket.on(ChatEvent.LIST_MESSAGES, (cb: SocketCallback<ListMessagesResponse>) => {
        console.log('[server](listMessages)');
        cb({
          res: {
            items: chatMessages.reverse()
          }
        })
      });

      socket.on("disconnected", () => {
        console.log('Client disconnected');
      });
    });
  }

  get app (): express.Application {
    return this._app;
  }
}