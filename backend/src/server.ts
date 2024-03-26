import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import { OfferHashRequest, OfferData } from './types/Offer';
import { getOfferData } from './utils/walletApi';

const { PORT } = process.env;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// HTTP server endpoint
app.post('/offer', async (req, res) => {
  try {
    const { offer } = req.body as OfferHashRequest;
  
    // Fetch offer summary from the wallet API
    const newOfferData = await getOfferData({ offer }) as OfferData;
  
    // Send the transformed offer data to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newOfferData));
      }
    });

    console.log(`offer data is valid: ${newOfferData.isValid}`);
    
    res.sendStatus(200);  
  } catch (error) {
    console.log(`OFFER ENDPOINT ERROR: ${error}`);
    res.sendStatus(500);
  }
});

// WebSocket server
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

const port = PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});