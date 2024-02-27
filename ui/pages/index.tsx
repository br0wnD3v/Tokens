import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { Flex, Image, Box, Spacer, Button, useToast } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useState } from "react";

import { bdAddress, bdABI } from "../utils/constants";

const Home: NextPage = () => {
  const account = useAccount();
  const toast = useToast();
  const ethers = require("ethers");
  const [balance, setBalance] = useState("");

  async function parseBigInt(bigIntValue: bigint): Promise<string> {
    const bigIntString = bigIntValue.toString();

    // Calculate the position to insert the decimal point
    const decimalPosition = bigIntString.length - 6;

    // Insert the decimal point  6 places from the right
    const stringWithDecimal =
      bigIntString.slice(0, decimalPosition) +
      "." +
      bigIntString.slice(decimalPosition);

    return stringWithDecimal;
  }

  async function fetchInformation() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(bdAddress, bdABI, signer);
      const bal = await token.balanceOf(signer);
      setBalance(await parseBigInt(bal));
    }
  }

  if (account && account.address) fetchInformation();

  async function handleMint() {
    if (account && account.address && window && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(bdAddress, bdABI, signer);

      const txn = await token.mint();
      const receipt = await txn.wait(1);

      if (receipt && receipt.status && receipt.status == 1) {
        toast({
          title: "Mint Success!",
          status: "success",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
        fetchInformation();
      }
    }
  }

  return (
    <>
      <Head>
        <title>Br0wnD3v Tokens</title>
        <meta content="" name="Br0wnD3v's Mock Tokens" />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Flex position={"relative"}>
        <Image
          src="/bdback.jpg"
          position={"absolute"}
          objectFit={"cover"}
          h={"100vh"}
          w={"100vw"}
          top={0}
          alt="Background"
          sx={{ filter: "brightness(50%)" }}
        />
        <Flex
          position={"relative"}
          m={10}
          h={"100%"}
          w={"100%"}
          direction={"column"}
        >
          <Flex direction={"row"} w={"100%"}>
            <Box bgColor={"white"} color={"black"} p={2} borderRadius={10}>
              Holding : {balance.toString()} BR0D3
            </Box>
            <Spacer />
            <ConnectButton label="Connect" />
          </Flex>
          <Flex
            h={"100%"}
            w={"100%"}
            align={"center"}
            justify={"center"}
            pt={220}
          >
            <Button
              p={8}
              fontSize={"2xl"}
              colorScheme="green"
              onClick={() => handleMint()}
            >
              MINT
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
