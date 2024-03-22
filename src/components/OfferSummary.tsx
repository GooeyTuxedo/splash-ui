import { FC } from "react";

interface OfferSummaryProps {
  key: string;
  isValid: boolean;
  offered: Record<string, number>;
  requested: Record<string, number>;
}

const OfferSummary: FC<OfferSummaryProps> = ({
  isValid,
  offered,
  requested,
}) => {
  const [[offeredName, offeredAmount]] = Object.entries(offered);
  const [[requestedName, requestedAmount]] = Object.entries(requested);
  return (
    <div
      className={`p-4 rounded-md flex items-center space-x-2 ${
        isValid ? 'bg-white' : 'bg-gray-300'
      }`}
    >
      <span>{offeredAmount}x {offeredName}</span>
      <span>&#8594;</span>
      <span>{requestedAmount}x {requestedName}</span>
    </div>
  );
};

export default OfferSummary;