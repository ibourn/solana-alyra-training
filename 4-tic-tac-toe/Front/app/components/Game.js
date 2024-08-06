import style from "../styles/TableRow.module.css";

const Game = ({
  account,
  publicKey
}) => {
  return (
    <div className={style.wrapper}>
      <div class = "ui"> 
            <div className={style.row}> 
                <input type="text" id= "b1" value={account.board[0] ? Object.keys(account.board[0][0] || {}).join('') : ''}
                       className={style.cell} onClick={() => { myfunc_5(); myfunc(); }} 
                       readonly /> 
                <input type="text" id= "b2" value={account.board[0] ? Object.keys(account.board[0][1] || {}).join('') : ''}
                       className={style.cell} onClick={() => { myfunc_5(); myfunc(); }} 
                       readonly /> 
                <input type="text" id= "b3" className={style.cell} value={account.board[0] ? Object.keys(account.board[0][2] || {}).join('') : ''}
                       onClick={() => { myfunc_5(); myfunc(); }} 
                       readonly /> 
            </div> 
            <div className={style.row}> 
                <input type="text" id= "b4" value={account.board[1] ? Object.keys(account.board[1][0] || {}).join('') : ''}
                       className={style.cell} onClick={() => { myfunc_5(); myfunc(); }} 
                       readonly /> 
                <input type="text" id= "b5" value={account.board[1] ? Object.keys(account.board[1][1] || {}).join('') : ''}
                       className={style.cell} onClick={() => { myfunc_5(); myfunc(); }} 
                       readonly /> 
                <input type="text" id= "b6" value={account.board[1] ? Object.keys(account.board[1][2] || {}).join('') : ''}
                       className={style.cell} onClick={() => { myfunc_5(); myfunc(); }} 
                       readonly /> 
            </div> 
            <div className={style.row}> 
                <input type="text" id= "b7" value={account.board[2] ? Object.keys(account.board[2][0] || {}).join('') : ''}
                       className={style.cell} onClick={() => { myfunc_5(); myfunc(); }} 
                       readonly /> 
                <input type="text" id= "b8" value={account.board[2] ? Object.keys(account.board[2][1] || {}).join('') : ''}
                       className={style.cell} onClick={() => { myfunc_5(); myfunc(); }} 
                       readonly /> 
                <input type="text" id= "b9" value={account.board[2] ? Object.keys(account.board[2][2] || {}).join('') : ''}
                       className={style.cell} onClick={() => { myfunc_5(); myfunc(); }} 
                       readonly /> 
            </div> 
        </div> 
      <p>Joueur 1 : {account.players[0].toBase58()}</p>
      <p>Joueur 2 : {account.players[1].toBase58()}</p>
      <p>Tour : {account.turn}</p>
    </div>
  );
};

export default Game;
