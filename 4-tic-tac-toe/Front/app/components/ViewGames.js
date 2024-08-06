import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAppContext } from "../context/context";
import Game from "./Game";

const ViewGames = () => {

  const {games} = useAppContext();

  return (
    <div>
      <h2>Games in progress</h2>
      {games?.map((h, i) => (
        <>
          <h3>Game {i+1}</h3>
          <Game key={i} {...h} />
          </>
        ))}
    </div>
  );
};

export default ViewGames;
