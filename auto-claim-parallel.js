import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const RECIPIENT = process.env.RECIPIENT_ADDRESS;
const ENDPOINT  = 'https://testnet.hub.intuition.systems/api/trpc/faucet.requestFaucetFunds?batch=1';
const WORKERS   = 5;
const DELAY_MS  = 0;

const HEADERS = {
  'accept': '*/*',
  'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'cache-control': 'no-cache',
  'content-type': 'application/json',
  'origin': 'https://testnet.hub.intuition.systems',
  'pragma': 'no-cache',
  'referer': 'https://testnet.hub.intuition.systems/',
  'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function claim(workerId) {
  const payload = {
    0: {
      json: {
        rollupSubdomain: 'intuition-testnet',
        recipientAddress: RECIPIENT,
        turnstileToken: '',
        tokenRollupAddress: null
      },
      meta: { values: { tokenRollupAddress: ['undefined'] } }
    }
  };

  try {
    const res = await axios.post(ENDPOINT, payload, { headers: HEADERS });
    console.log(`[Worker ${workerId}] OK →`, JSON.stringify(res.data));
  } catch (err) {
    console.error(`[Worker ${workerId}] ERR →`, err.toString());
  }
}

async function workerLoop(workerId) {
  while (true) {
    await claim(workerId);
    if (DELAY_MS > 0) await sleep(DELAY_MS);
  }
}

async function main() {
  for (let i = 1; i <= WORKERS; i++) {
    workerLoop(i);
  }
}

main();
