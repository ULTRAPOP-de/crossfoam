import { workerOverviewNetwork } from "@crossfoam/network";

declare function postMessage(message: {}, targetOrigin?: string, transfer?: any[]): void;

onmessage = (event) => {
  postMessage(workerOverviewNetwork(event));
};
