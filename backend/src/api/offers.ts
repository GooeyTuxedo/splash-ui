import type { NextApiRequest, NextApiResponse } from 'next';

import { OfferHashRequest, OfferData } from '@/types/Offer';
import { getOfferData } from '@/utils/walletApi';

// Store the stream data and validity state
let offerDataList: OfferData[] = [];

// Function to send stream data to the client
const sendStreamDataToClient = (res: NextApiResponse, data: OfferData) => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OfferData | { error: string }>
) {
  if (req.method === 'POST') {
    const { offer } = req.body as OfferHashRequest;

    // Fetch offer summary from the wallet API
    const newOfferData = await getOfferData({ offer }) as OfferData;

    offerDataList = [newOfferData].concat(offerDataList);

    // Limit the array length to the most recent 25 entries
    offerDataList = offerDataList.slice(0, 25);

    // Send the new data to the client
    sendStreamDataToClient(res, newOfferData);

    res.status(200).json(newOfferData);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}