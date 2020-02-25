import constants from "./constants";

const helpers = {
  sumCoins: (coinList) => {
    return coinList.reduce((total, coin) => total += coin.value, 0);
  },

  convertValueToPounds: (value) => {
    return `£ ${(value / 100).toFixed(2)}`;
  },

  usedCoinText: (usedCoins) => {
    return usedCoins.reduce((text, coin) => (text += `${coin.label} `), "").trim();
  },

  handleReturns: (coinInventory, totalAmount) => {
    let remainingAmount = totalAmount;
    let usedCoins       = [];

    // Clones and sorts available coins inside the machine
    const sortedCoins = coinInventory.map(coin => ({...coin}))
                                     .sort((first, next) => (
                                       next.value - first.value
                                     ));

    let remainingCoins = sortedCoins.map(coin => ({...coin}));

    for (let coin of sortedCoins) {
      const { value } = coin;
      if (Math.floor(remainingAmount / value) >= 1 && value <= remainingAmount) {
        // This coin has enough value to be used
        const remainingCoin = remainingCoins.find(c => c.value === value);
        
        usedCoins = [...usedCoins, coin];
        remainingCoins  = remainingCoins.filter(c => c !== remainingCoin);
        remainingAmount -= value;
      }

      if (remainingAmount === 0) {
        return { usedCoins, remainingCoins };
      } else if (remainingCoins.length === 0) {
        return false;
      }
    };
  },

  mintCoin: (value, quantity) => {
    const coin = constants.coinList.find(c => c.value === value);

    let coinList = [...Array(quantity).keys()]
    return coinList.map(c => ({...coin}));
  },

  groupCoins: (coinInventory) => {
    const initialGroups = constants.coinList.map(c => ({...c, quantity: 0}));

    return coinInventory.reduce((groups, coin) => {
      let group = groups.find(g => g.value === coin.value);
      group.quantity += 1;

      return groups;
    }, initialGroups);
  }
}

export default helpers;