import ShortId from "shortid";
import helpers from "./helpers";

const initialLoad = {
  products: [
    { id: ShortId.generate(), stock: 3, name: "Cola"     , price: 90  },
    { id: ShortId.generate(), stock: 2, name: "Sandwich" , price: 120 },
    { id: ShortId.generate(), stock: 5, name: "Croissant", price: 100 },
    { id: ShortId.generate(), stock: 1, name: "Chocolate", price: 70  },
    { id: ShortId.generate(), stock: 0, name: "Candy"    , price: 60  },
    { id: ShortId.generate(), stock: 2, name: "Almonds"  , price: 85  },
    { id: ShortId.generate(), stock: 9, name: "Chips"    , price: 97  },
    { id: ShortId.generate(), stock: 3, name: "Water"    , price: 45  }
  ],
  coins: [
    ...helpers.mintCoin(200, 1),
    ...helpers.mintCoin(100, 2),
    ...helpers.mintCoin(50, 3),
    ...helpers.mintCoin(20, 5),
    ...helpers.mintCoin(10, 5),
    ...helpers.mintCoin(5, 5),
    ...helpers.mintCoin(2, 5),
    ...helpers.mintCoin(1, 10)
  ]
}

export default initialLoad;