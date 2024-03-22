import type { NextApiRequest, NextApiResponse } from 'next';

import { OfferHashRequest, OfferData } from '@/types/Offer';
import { getOfferData } from '@/utils/walletApi';

// Store the stream data and validity state
let offerDataList: OfferData[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OfferData[]>
) {
  // Function to send offer data to the client
  const sendOfferDataToClient = (data: OfferData) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };


  if (req.method === 'POST') {
    const { offer } = req.body as OfferHashRequest;

    // Fetch offer summary from the wallet API
    const newOfferData = await getOfferData({ offer });

    offerDataList = [newOfferData].concat(offerDataList);

    // Limit the array length to the most recent 25 entries
    offerDataList = offerDataList.slice(0, 25);

    // Send the new data to the client
    sendOfferDataToClient(newOfferData);
  } else if (req.method === 'GET') {
    // Return the current stream data
    res.status(200).json(offerDataList);
    return;
  }

  // Set up Server-Sent Events (SSE)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Handle client disconnection
  req.socket.on('close', () => {
    // Clean up any resources if needed
  });
}