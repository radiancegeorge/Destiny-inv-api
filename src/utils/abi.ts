export const abi: any = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "email",
        type: "bytes32",
      },
      { indexed: false, internalType: "uint8", name: "plan", type: "uint8" },
    ],
    name: "PayForPlan",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "uint16", name: "plan", type: "uint16" },
          { internalType: "address", name: "_address", type: "address" },
        ],
        indexed: false,
        internalType: "struct Storage.PayoutProperties[]",
        name: "_data",
        type: "tuple[]",
      },
    ],
    name: "Payout",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "Plans",
    outputs: [
      { internalType: "bytes32", name: "name", type: "bytes32" },
      { internalType: "uint256", name: "price", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "USDNGN",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "USDT",
    outputs: [
      { internalType: "contract ERC20Token", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint8", name: "_planId", type: "uint8" },
      { internalType: "bytes32", name: "_name", type: "bytes32" },
      { internalType: "uint256", name: "_price", type: "uint256" },
    ],
    name: "createPlan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlans",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "name", type: "bytes32" },
          { internalType: "uint256", name: "price", type: "uint256" },
        ],
        internalType: "struct Storage.Plan[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "_planId", type: "uint8" }],
    name: "getSinglePlan",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "name", type: "bytes32" },
          { internalType: "uint256", name: "price", type: "uint256" },
        ],
        internalType: "struct Storage.Plan",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_email", type: "bytes32" },
      { internalType: "uint8", name: "_plan", type: "uint8" },
    ],
    name: "payForPlan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint16", name: "plan", type: "uint16" },
          { internalType: "address", name: "_address", type: "address" },
        ],
        internalType: "struct Storage.PayoutProperties[]",
        name: "_data",
        type: "tuple[]",
      },
    ],
    name: "payout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "_value", type: "uint8" }],
    name: "setEarnPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "_value", type: "uint8" }],
    name: "setPlanLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
    name: "setUSDNGNRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "setUsdtTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_address", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
