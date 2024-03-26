import { FC, useEffect, useState } from 'react';

import { connectWebSocket, disconnectWebSocket, onOfferData, offOfferData } from '@/utils/websocketListener';
import { OfferData } from '@/types/Offer';
import OfferSummary from '@/components/OfferSummary';


const Home: FC = () => {
  const [offerDataList, setOfferDataList] = useState<OfferData[]>([]);

  useEffect(() => {
    connectWebSocket();

    const handleOfferData = (newOffer: OfferData) => {
      setOfferDataList((prevDataList) => [newOffer, ...prevDataList.slice(0, 24)]);
    };

    onOfferData(handleOfferData);
    
    return () => {
      offOfferData(handleOfferData);
      disconnectWebSocket();
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
