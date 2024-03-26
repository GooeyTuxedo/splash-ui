import { EventEmitter } from 'events';

import { OfferData } from '@/types/Offer';

const { WEBSOCKET_HOST, WEBSOCKET_PORT } = process.env;
const wsHost = WEBSOCKET_HOST ? WEBSOCKET_HOST : "localhost";
const wsPort = WEBSOCKET_PORT ? WEBSOCKET_PORT : 3001;

const eventEmitter = new EventEmitter();

let socket: WebSocket | null = null;

export const connectWebSocket = () => {
  if (!socket) {
    socket = new WebSocket(`ws://${wsHost}:${wsPort}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data: OfferData = JSON.parse(event.data);
      eventEmitter.emit('data', data);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      socket = null;
    };
  }
};

export const onOfferData = (callback: (data: OfferData) => void) => {
  eventEmitter.on('data', callback);
};

export const offOfferData = (callback: (data: OfferData) => void) => {
  eventEmitter.off('data', callback);
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};