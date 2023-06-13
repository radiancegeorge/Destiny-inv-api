type _data = {
  _address: string;
  plan: string;
};
export interface PayoutLog {
  address: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
  id: string;
  returnValues: {
    "0": _data[];
    _data: _data[];
  };
  event: string;
  signature: string;
  raw: {
    data: string;
    topics: string[];
  };
}

export interface PayForPlanData {
  address: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
  id: string;
  returnValues: {
    "0": string;
    "1": string;
    email: string;
    plan: string;
  };
  event: string;
  signature: string;
  raw: {
    data: string;
    topics: string[];
  };
}
