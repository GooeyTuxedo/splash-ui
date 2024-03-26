import { FC, useEffect, useState } from 'react';

import { OfferData } from '@/types/Offer';
import OfferSummary from '../components/OfferSummary';

const { WEBSOCKET_HOST, WEBSOCKET_PORT } = process.env;

const Home: FC = () => {
  const [offerDataList, setOfferDataList] = useState<OfferData[]>([]);

  useEffect(() => {
    const webSocket = new WebSocket(`ws://${WEBSOCKET_HOST}:${WEBSOCKET_PORT}`);

    webSocket.onmessage = (event) => {
      const data: OfferData = JSON.parse(event.data);
      setOfferDataList((prevDataList) => [data, ...prevDataList.slice(0, 24)]);
    };

    return () => {
      webSocket.close();
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 space-y-4">
        <h1>Offers from Dexie Splash</h1>
        {offerDataList.map((offer) => (
          <OfferSummary
            key={offer.offerHash}
            isValid={offer.isValid}
            offered={offer.offered}
            requested={offer.requested}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
