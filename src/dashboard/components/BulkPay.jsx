import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
// import { ArrowBack, Payment } from "@mui/icons-material";
import styled from "styled-components";
import Web3 from "web3";
import { abi } from "../../utils/abi";
import { useNavigate } from "react-router-dom";
import { Modal } from "@adminjs/design-system";
import { Typography } from "@mui/material";

export default function BulkPay(props) {
  console.log(props);
  const web3 = React.useRef();
  React.useEffect(() => {
    ethEnabled();
  }, []);
  const ethEnabled = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3.current = new Web3(window.ethereum);
      return true;
    } else {
      window.alert("Metamask not found!");
      throw "Metamask not found";
    }
  };
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const bulkPayment = async () => {
    try {
      const contractAddress = "0x852D2D737a24c1715FcA3ac3c3cC206AbE8C0224";
      const contract = new web3.current.eth.Contract(abi, contractAddress);
      const [from] = await web3.current.eth.getAccounts();
      await contract.methods
        .payout(props.records.map((data) => data.contractPayload))
        .send({ from });
      setDone(true);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (done) {
      setTimeout(() => {
        window.location.href = props.resource.href;
      }, 2000);
    }
  }, [done]);
  return (
    <>
      {done && (
        <Modal>
          <Icon>Done!</Icon>
        </Modal>
      )}
      <ReceiptContainer>
        <Stack direction="row" spacing={2}>
          {!loading ? (
            <>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setLoading(true);
                  bulkPayment();
                }}>
                Pay
              </Button>
            </>
          ) : (
            <Typography>Please wait...</Typography>
          )}
        </Stack>
      </ReceiptContainer>
    </>
  );
}
const Icon = styled.div`
  justify-content: center;
  align-items: center;
  width: 100%;
  display: flex;
`;
const ReceiptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: orange;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;
