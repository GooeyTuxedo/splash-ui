import { OfferData, OfferHashRequest } from "@/types/Offer";
import { RPCAgent, setLogLevel } from "chia-agent";
import { check_offer_validity, get_offer_summary } from "chia-agent/api/rpc/wallet";

const {
  WALLET_RPC_HOST,
  WALLET_RPC_PORT
} = process.env;

setLogLevel("debug");

const agent = new RPCAgent({
  service: "wallet",
  host: WALLET_RPC_HOST || "localhost",
  port: WALLET_RPC_PORT ? Number(WALLET_RPC_PORT) : 9256
});


export const checkOfferValidity = async (data: OfferHashRequest): Promise<boolean | void> => {
  try {
    const response = await check_offer_validity(agent, data);
    return response.valid;
  } catch (reason) {
    console.log(`validity check failed: ${reason}`)
  }
};

export const getOfferData = async (data: OfferHashRequest): Promise<OfferData | void> => {
  try {
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
  } catch (reason) {
    console.log(`offer data fetch failed: ${reason}`)
  }
};