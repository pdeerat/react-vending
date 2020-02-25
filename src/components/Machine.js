import React from 'react';
import Product from './Product';
import CoinInserter from "./CoinInserter";
import helpers from "../scripts/helpers";
import constants from "../scripts/constants";
import initialLoad from "../scripts/initialLoad";
import Display from './Display';
import RestockMenu from './RestockMenu';
import ShortId from 'shortid';

class Machine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productInventory: initialLoad.products,
      coinInventory:    initialLoad.coins,
      insertedCoins:    [],
      clientInventory:  [],
      returnedCoins:    [],
      specialMsg:       false,
      isRestocking:     false
    }
  }

  addCoin(value) {
    const newCoin = helpers.mintCoin(value, 1);
    this.setState(prevState => ({
      coinInventory: [...prevState.coinInventory, ...newCoin]
    }));
  }

  removeCoin(value) {
    const coinToRemove = this.state.coinInventory.find(c => c.value === value);

    if (coinToRemove) {
      this.setState(prevState => ({
        coinInventory: prevState.coinInventory.filter(c => c !== coinToRemove)
      }));
    }
  }

  addProduct(attributes) {
    const newProduct = {
      name:  attributes.productName,
      price: attributes.productPrice,
      stock: attributes.productStock,
      id:    ShortId.generate()
    }

    this.setState(prevState => ({
      productInventory: [...prevState.productInventory, newProduct]
    }));
  }

  removeProduct(productId) {
    this.setState(prevState => ({
      productInventory: prevState.productInventory.filter(p => p.id !== productId)
    }));
  }

  insertCoin(coin) {
    this.setState(prevState => (
      {
        insertedCoins: [...prevState.insertedCoins, coin],
        coinInventory: [...prevState.coinInventory, coin]
      }
    ));

    this.clearDisplay();
  }

  clearDisplay() {
    this.setState({ specialMsg: false, returnedCoins: [] });
  }

  handleTransaction(productId) {
    const product = this.state.productInventory.find(p => p.id === productId);
    const clientAmount = helpers.sumCoins(this.state.insertedCoins);
    const remainAmount = clientAmount - product.price;

    if (remainAmount < 0) {
      this.setState({
        specialMsg: constants.displayMessages.noMoney
      });
      return;
    }

    const returns = helpers.handleReturns(this.state.coinInventory, remainAmount);
    
    if (returns) {
      const { usedCoins, remainingCoins } = returns;
      let clonedProductList = this.state.productInventory.map(p => ({...p}));
      let clonedProduct     = clonedProductList.find(p => p.id === productId);
      clonedProduct.stock   = product.stock - 1;

      this.setState({
        insertedCoins: [],
        productInventory: clonedProductList,
        coinInventory: remainingCoins,
        returnedCoins: usedCoins,
        specialMsg: constants.displayMessages.success
      });
    } else {
      this.setState({
        specialMsg: constants.displayMessages.noCoins
      });
    }
  }

  renderProducts(products) {
    return products.map(product => (
             <Product key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      stock={product.stock}
                      handleTransaction={this.handleTransaction.bind(this)}>
             </Product>
      ));
  }

  render() {
    const productList = this.renderProducts(this.state.productInventory);

    return <div className="vending-machine">
             <h3>Products</h3>
             <div className="flex three">
               {productList}
             </div>

            <div className="flex two">
              <div>
                <h3>Insert Coins</h3>
                <div>
                  {constants.coinList.map(coin => 
                    <CoinInserter key={coin.label}
                                  coin={coin}
                                  insertCoin={this.insertCoin.bind(this)}>
                    </CoinInserter>
                  )}
                </div>
              </div>
              <div>
                <h3>Display</h3>
                <Display balance={helpers.sumCoins(this.state.insertedCoins)}
                          returnedCoins={this.state.returnedCoins}
                          specialMsg={this.state.specialMsg}>
                </Display>
              </div>
            </div>

             <label htmlFor="restock-menu" className="button">
               Restock Machine
             </label>

             <RestockMenu products={this.state.productInventory}
                          coins={this.state.coinInventory}
                          addCoin={this.addCoin.bind(this)}
                          removeCoin={this.removeCoin.bind(this)}
                          addProduct={this.addProduct.bind(this)}
                          removeProduct={this.removeProduct.bind(this)}>
             </RestockMenu>

           </div>
  }
}

export default Machine;