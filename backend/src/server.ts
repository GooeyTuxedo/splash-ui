import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// HTTP server endpoint
app.post('/offer', (req, res) => {
  const { offer } = req.body;
  
  // Transform the event data
  const transformedData = {
    // Perform any necessary data transformation here
    transformedOffer: offer.toUpperCase(),
  };
  
  // Send the transformed data to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(transformedData));
    }
  });
  
  res.sendStatus(200);
});

// WebSocket server
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});