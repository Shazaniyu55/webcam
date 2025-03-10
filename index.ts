import express from "express";
import http from "http";
import userRoutes from './routes/userroutes.js';
import connectDB from "./services/db.js";
import {Server} from 'socket.io';
import websocket from "./util/websocket.js";
import { fileURLToPath } from "url";
import path from "path";
import { WebSocketServer, WebSocket } from 'ws';
import session  from "express-session";
import cors from "cors";

// Define __dirname equivalent in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 2650;
const wss = new WebSocketServer({ port: 8080 });
const server = http.createServer(app);


interface Client {
    id: string;
    socket: WebSocket;
  }

//Store connected clients
const clients = new Map<string, Client>();


connectDB();
app.use(session({
  secret: 'webcamwebapp', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


app.use(cors({
  origin: "https://webcam-production.up.railway.app/videocall",          // Removed the trailing slash
  methods: 'GET, POST, PUT, DELETE',       // Methods allowed
  allowedHeaders: 'Content-Type, Authorization' // Corrected 'authorization' to 'Authorization'
}));

app.options('*', cors())
app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.json());
app.use("/api/users", userRoutes);


app.set('views', path.join(__dirname, 'views')); 



wss.on('connection', (ws) => {
    const clientId = generateClientId();
    clients.set(clientId, { id: clientId, socket: ws });  
    console.log(`Client ${clientId} connected`);

     // Notify all users that a new client has joined
  broadcast({ type: "userConnected", userId: clientId });

    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
      //console.log(data)
      if (data.to && clients.has(data.to)) {
        // Send message to the specific client
        clients.get(data.to)?.socket.send(JSON.stringify({ from: clientId, ...data }));
      }
    });
  
    ws.on('close', () => {
      clients.delete(clientId);
      console.log(`Client ${clientId} disconnected`);
    });
  });
  
  // Function to generate a random ID
  function generateClientId() {
    return Math.random().toString(36).substring(7);
  }

  // Function to broadcast messages to all clients
function broadcast(message: object) {
  clients.forEach(client => client.socket.send(JSON.stringify(message)));
}

app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
})

app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
})

app.get('/videocall', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})


server.listen(port, ()=>{console.log(`server running at port http://localhost:${port}`)});

export default app;



