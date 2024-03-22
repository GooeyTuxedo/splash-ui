import { FC, useEffect, useState } from 'react';
import axios from 'axios';

import { OfferData } from '@/types/Offer';
import OfferSummary from '../components/OfferSummary';

interface HomeProps {
  initialOfferDataList: OfferData[];
}

const Home: FC<HomeProps> = ({ initialOfferDataList }) => {
  const [offerDataList, setOfferDataList] = useState<OfferData[]>(initialOfferDataList);

  useEffect(() => {
    // Set up Server-Sent Events (SSE)
    const eventSource = new EventSource('/api/offers');

    eventSource.onmessage = (event) => {
      const data: OfferData = JSON.parse(event.data);
      setOfferDataList((prevDataList) => {
        const updatedDataList = [...prevDataList];
        const index = updatedDataList.findIndex((entry) => entry.offerHash === data.offerHash);
        if (index !== -1) {
          updatedDataList[index] = data;
        } else {
          updatedDataList.unshift(data);
        }
        return updatedDataList;
      });
    };

    return () => {
      eventSource.close();
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

export const getServerSideProps = async () => {
  // Fetch initial stream data from the server
  const response = await axios.get('http://localhost:3000/api/offers');
  const initialOfferDataList = response.data;

  return {
    props: {
      initialOfferDataList,
    },
  };
};

export default Home;
