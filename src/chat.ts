import * as express from 'express';
import * as socketIo from 'socket.io';
import { createServer, Server } from 'http';
import * as cors from "cors";

export enum ChatEvent {
  MESSAGE = 'message',
  LIST_MESSAGES = 'listMessages'
};

interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  username: string;
  createdAt: string;
  status: "none" | "receivedByServer";
}

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

      socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
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