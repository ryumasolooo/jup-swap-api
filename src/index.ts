import { createJupiterApiClient, SwapMode } from '@jup-ag/api';
import { VersionedTransaction } from '@solana/web3.js';
import * as Env from 'dotenv';
import envExpand from 'dotenv-expand';

envExpand(Env.config());

const endpoint = process.env.ENDPOINT;
console.log("endpoint", endpoint);

function main() {
  console.log();
  testJupApi();
}

async function testJupApi() {
  let transaction : VersionedTransaction;
  try {
    transaction = await createSwapJupTx();
    console.log("Succes create transaction swap using jup api.");
  } catch (error) {
    console.log("Failed create and swap tx :", error);
  }
}


async function createSwapJupTx():Promise<VersionedTransaction> {

  const CONFIG = {
    basePath: endpoint
  };
  const jupiterApi = createJupiterApiClient(CONFIG);

  console.log("getting quote jup...");
  const swapMode:SwapMode = 'ExactIn';
  const payloadQuote = {
    inputMint: 'Dso1bDeDjCQxTrWHqUUi63oBvV7Mdm6WaobLbQ7gnPQ',
    outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    amount: 158857566,
    slippageBps: 120,
    swapMode: swapMode
  };
  console.log("payloadQuote", payloadQuote);
  const quote = await jupiterApi.quoteGet(payloadQuote);
  console.log("result quote :", quote);

  console.log();
  console.log();

  console.log("getting swap jup...");
  const payloadSwap = {
    swapRequest: {
      quoteResponse: quote,
      userPublicKey: 'Gentw3oGEL1irakwhxqbQtNgZ79jDpdiP9nfXKucoYYC'
    }
  };
  console.log("payloadSwap", payloadSwap);
  const swapTransaction = await jupiterApi.swapPost(payloadSwap);
  console.log("swapTransaction", swapTransaction);

  const swapTransactionBuf = Buffer.from(swapTransaction.swapTransaction, 'base64');
  return VersionedTransaction.deserialize(swapTransactionBuf);

}

main();