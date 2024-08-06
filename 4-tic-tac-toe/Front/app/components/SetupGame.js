import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAppContext } from "../context/context";

import style from "../styles/Header.module.css";

const SetupGame = () => {

  const {createGame} = useAppContext();

  return (
    <a onClick={createGame}>
       Create A Game
    </a>
  );
};

export default SetupGame;
