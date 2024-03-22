import { OfferData, OfferHashRequest } from "@/types/Offer";
import { RPCAgent } from "chia-agent";
import { check_offer_validity, get_offer_summary } from "chia-agent/api/rpc/wallet";

const {
  WALLET_RPC_HOST,
  WALLET_RPC_PORT
} = process.env;

const agent = new RPCAgent({
  protocol: "http",
  host: WALLET_RPC_HOST || "localhost",
  port: Number(WALLET_RPC_PORT) || 9256
});

export const checkOfferValidity = async (data: OfferHashRequest): Promise<boolean> => {
  const response = await check_offer_validity(agent, data);
  return response.valid;
};

export const getOfferData = async (data: OfferHashRequest): Promise<OfferData> => {
  const isValid = await checkOfferValidity(data);
  const response = await get_offer_summary(agent, data);

  const {
    offered,
    fees,
    requested,
  } = response.summary;

  const offerData = {
    isValid,
    offered,
    fees,
    requested,
    offerHash: data.offer
  } as OfferData;

  return offerData;
};