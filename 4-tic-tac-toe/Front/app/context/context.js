import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { BN } from "@project-serum/anchor";
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { PublicKey, Keypair } from "@solana/web3.js";
import { Program, utils } from "@project-serum/anchor";

import {
  getLotteryAddress,
  getMasterAddress,
  getProgram,
  getRandomAddress,
  getTicketAddress,
  getTotalPrize,
} from "../utils/program";
import { confirmTx, mockWallet } from "../utils/helper";
import toast from 'react-hot-toast';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get provider
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const program = useMemo(() => {
    if (connection) {
      return getProgram(connection, wallet ?? mockWallet());
    }
  }, [connection, wallet]);

  useEffect(() => {
    viewGames()
  }, [program]);

  const [games, setGames] = useState([]);

  const viewGames = async () => {
    const games = await program.account.game.all();
    setGames(games);
    console.log("games", games);
  }

  const createGame = async () => {
    setError("");
    setSuccess("");
    console.log("Running")
    try {
      const gameKeypair = Keypair.generate();

      const txHash = await program.methods
        .setupGame(wallet.publicKey)
        .accounts({
          game: gameKeypair.publicKey,
          playerOne: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([gameKeypair])
        .rpc();
      await confirmTx(txHash, connection);

      toast.success("Created a game")
    } catch (err) {
      console.log("err", err);
      setError(err.message);
      toast.error("Game Creation FAILED!")
    }
  };

  return (
    <AppContext.Provider
      value={{
        createGame,
        viewGames,
        games,
        error, 
        success
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
