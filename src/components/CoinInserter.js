import React from "react";

const CoinInserter = ({ coin, insertCoin }) => {
  return <button type="button"
                 onClick={() => insertCoin(coin)}>
                   {coin.label}
         </button>
}

export default CoinInserter;