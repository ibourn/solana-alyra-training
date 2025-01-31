import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { SystemProgram } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { BN } from "bn.js";

import {
  getProgram,
  getVoterAddress
} from "../utils/program";
import { confirmTx, mockWallet } from "../utils/helper";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const program = useMemo(() => {
    if (connection) {
      // TODO 2 Uncomment cette ligne
      return getProgram(connection, wallet ?? mockWallet());
    }
  }, [connection, wallet]);

  useEffect(() => {
    if(votes.length == 0){
      viewVotes();
    }
  }, [program]);

  const [votes, setVotes] = useState([]);

  // TODO 3
  // viewVotes est la méthode utilisé pour récupérer tous les votes et implémenter la variable "votes"
  // Bonus : trier le tableau des votes par deadline
  const viewVotes = async () => {
    const votes = await program.account.proposal.all();
    const sortedVotes = votes.sort((a, b) => a.account.deadline - b.account.deadline);
    setVotes(sortedVotes);
    

    if(wallet && wallet.publicKey){
      const updatedVotes = await Promise.all(sortedVotes.map(async(vote) => {
        const voterAccountAddress = await getVoterAddress(vote.publicKey, wallet.publicKey);
        const voterInfo = await program.account.voter.fetchNullable(voterAccountAddress);
        return {
          ...vote,
          voterInfo: voterInfo
        };
      }));

      setVotes(updatedVotes);
    }
  }

  // TODO 4
  // createVote est la méthode utilisé pour créer un vote à partir du formulaire rempli par l'utilisateur
  // Indice 1 : Aller voir où est appelé cette méthode et les paramètres transmis
  // Indice 2 : Générer aléatoirement une keypair pour le voteAccount
  // Indice 3 : Appeler la méthode du smart contract creerVote
  // Indice 4 : Avec les 3 paramètres + 3 accounts + signers
  // Indice 5 : Utiliser confirmTx
  const createVote = async (topic, description, options, duration) => {
    setError("");
    setSuccess("");
    try {
      const voteAccountKeypair = Keypair.generate();

      const txHash = await program.methods
        .createProposal(topic, description, options, new BN(duration))
        .accounts({
          proposal: voteAccountKeypair.publicKey,
          signer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([voteAccountKeypair])
        .rpc();
      await confirmTx(txHash, connection);

      viewVotes();
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  };

  const vote = async (index, votePubKey) => {    
    // TODO 5
    // vote est la méthode utilisé pour voter en tant qu'utilisateur
    // Indice 1 : Aller voir où est appelé cette méthode et les paramètres transmis
    // Indice 2 : Appeler la méthode du smart contract vote
    // Indice 3 : Avec 1 paramètre + 4 accounts
    // Indice 4 : Utiliser confirmTx
    setError("");
    setSuccess("");
    try {
      const voterAccountAddress = await getVoterAddress(votePubKey, wallet.publicKey);
      console.log("voterAccountAddress", voterAccountAddress);
      const txHash = await program.methods
        .castVote(index)
        .accounts({
          proposal: votePubKey,
          voter: voterAccountAddress,
          signer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      await confirmTx(txHash, connection);

      viewVotes();
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  };

  // TODO BONUS nouvelle fonctionnalité
  // Récupérer si l'utilisateur a déjà voté pour l'afficher à côté de l'option correspondante
  // Indice 1 : Faire un appel au smart contract pour récupérer le Voter account s'il existe (publickey généré avec la seed voteAccount + userWallet)

  return (
    <AppContext.Provider
      value={{
        createVote,
        viewVotes,
        vote,
        votes,
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