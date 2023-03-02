//Functions to perform database operations

let config = require("./dbconfig");
const sql = require("mssql");

async function getUsers() {
  try {
    //sql.connect() --> This method connects our server to database. It accepts the database configuration object and returns a promise.
    let pool = await sql.connect(config);

    // On the response of the connect method, we execute the query. In the query, we are passing the SQL query to be executed.
    let users = await pool.request().query("SELECT * from users");

    // We are returning the recordsets of the query result, which contain the records from the table in an array.
    return users.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getUser(user) {
  try {
    let pool = await sql.connect(config);
    let userRecord = await pool
      .request()
      .query(
        `SELECT * from users where email = '${user.email}' and password = '${user.password}'`
      );
    return userRecord.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByToken(token) {
  try {
    let pool = await sql.connect(config);
    let userRecord = await pool
      .request()
      .query(`SELECT * from users where token = '${token}'`);
    return userRecord.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByUserId(userId) {
  try {
    let pool = await sql.connect(config);
    let userRecord = await pool
      .request()
      .query(`SELECT * from users where userid = '${userId}'`);
    return userRecord.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByEmail(email) {
  try {
    let pool = await sql.connect(config);
    let userRecord = await pool
      .request()
      .query(`SELECT * from users where email = '${email}'`);
    return userRecord.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function setUserVerified(token) {
  try {
    let pool = await sql.connect(config);
    let userRecord = await pool
      .request()
      .query(`update users set verifiedUser =1 where token = '${token}'`);
    return userRecord.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function setUser(user) {
  try {
    console.log(user);
    let pool = await sql.connect(config);

    let insertUser = await pool
      .request()
      .query(
        `insert into users (firstName, lastName, email, password, phoneNumber, address, verifiedUser, token, status) values('${user.firstName}', '${user.lastName}','${user.email}','${user.password}','${user.phoneNumber}','${user.address}',${user.isVerified}, '${user.mailToken}', ${user.status})`
      );
    return insertUser.recordsets;
  } catch (err) {
    console.log(err);
  }
}

async function updateUser(user, status) {
  try {
    console.log(user);
    let pool = await sql.connect(config);

    let updateUser = await pool
      .request()
      .query(
        `update users set status= ${status} where userId = ${user.userId}`
      );
    return updateUser.recordsets;
  } catch (err) {
    console.log(err);
  }
}

async function getProducts() {
  try {
    let pool = await sql.connect(config);
    let products = await pool.request().query("Select * from products");
    return products.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getProductById(productId) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .query(`Select * from products where productId= ${productId}`);
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getnProducts(index) {
  try {
    let pool = await sql.connect(config);
    let productsList = await pool
      .request()
      .query(
        `Select * from products order by productId offset ${index} rows fetch next 5 rows only`
      );
    return productsList.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function setProduct(productInfo) {
  try {
    let pool = await sql.connect(config);
    let insertProduct = await pool.request()
      .query(`insert into products values('${productInfo.productName}',
    ${productInfo.price}, '${productInfo.productDesc}', 
    ${productInfo.stock}, '${productInfo.productImage}', 
    ${productInfo.sellerId})`);
    return insertProduct.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function enableDisableProduct(status) {
  try {
    let pool = await sql.connect(config);
    let productStatus = await pool
      .request()
      .query(`update products set status= ${status}`);
    return productStatus.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getCart(userId, productId) {
  try {
    let pool = await sql.connect(config);
    let cartItem = await pool
      .request()
      .query(
        `select cart.*,products.stock,products.price from cart inner join products on cart.productId=products.productId and cart.userId= ${userId} and cart.productId= ${productId}`
      );
    return cartItem.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getCartByUserId(userId) {
  try {
    let pool = await sql.connect(config);
    let cartItem = await pool
      .request()
      .query(
        `select cart.cartId, cart.quantity, products.* from cart inner join products on cart.productId = products.productId and userId= ${userId}`
      );
    return cartItem.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getCartByCartId(cartId) {
  try {
    let pool = await sql.connect(config);
    let cartItem = await pool
      .request()
      .query(`select cart.* from cart cartId= ${cartId}`);
    return cartItem.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function setCart(cart) {
  try {
    let pool = await sql.connect(config);
    let setcart = await pool.request()
      .query(`insert into cart values(${cart.userId},
    ${cart.productId}, ${cart.quantity})`);
    return setCart.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function updateCartQuantity(cartId, quantity) {
  try {
    let pool = await sql.connect(config);
    let cartQuantity = await pool
      .request()
      .query(`update cart set quantity= ${quantity} where cartId=${cartId}`);
    return setCart.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function removeFromCart(cartId) {
  try {
    let pool = await sql.connect(config);
    let removeCartItem = await pool
      .request()
      .query(`delete from cart where cartId= ${cartId}`);
    return removeCartItem.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function updatePassword(password, userId) {
  try {
    let pool = await sql.connect(config);
    let updateUserPassword = await pool
      .request()
      .query(
        `update users set password= '${password}' where userId= ${userId}`
      );
    return updateUserPassword.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function getSellerProducts(userId) {
  try {
    let pool = await sql.connect(config);
    let sellerProducts = await pool
      .request()
      .query(
        `select users.userId, products.productId, products.productName, products.price, products.productDesc, products.stock, products.productImage from users inner join products on users.userId = products.sellerId and userId= ${userId}`
      );
    return sellerProducts.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function checkStock(productId) {
  try {
    let pool = await sql.connect(config);
    let stock = await pool
      .request()
      .query(`select stock from products where productId=${productId}`);
    return stock;
  } catch (err) {
    console.log(err);
  }
}

async function setUserAddress(address, userId) {
  try {
    let pool = await sql.connect(config);
    let stock = await pool
      .request()
      .query(`update users set address ='${address}' where userId=${userId}`);
    return stock;
  } catch (err) {
    console.log(err);
  }
}
async function updateProductStock(productId, newStock) {
  try {
    let pool = await sql.connect(config);
    let productStock = await pool
      .request()
      .query(
        `update products set stock ='${newStock}' where productId=${productId}`
      );
    return productStock;
  } catch (err) {
    console.log(err);
  }
}

async function setOrder(orderId, productId, userId, quantity, price, orderTime, billingAddress){
  try{
    let pool=await sql.connect(config);
    let order=await pool.request.query(`insert into orders values(${orderId}, ${productId}, ${userId}, ${quantity}, ${price}, ${orderTime}, '${billingAddress}')`);
    return order;
  } catch(err){
    console.log(err);
  }
}

async function getUserAddress(userId){
  try{
    let pool=await sql.connect(config);
    let address=await pool.request.query(`get address from users where userId=${userId}`);
    return address;
  } catch(err){
    console.log(err);
  }
}

async function getUserAddress(userId){
  try{
    let pool=await sql.connect(config);
    let address=await pool.request.query(`get address from users where userId=${userId}`);
    return address;
  } catch(err){
    console.log(err);
  }
}

async function placeOrder(orderList) {
  let pool = await sql.connect(config);
  const transaction;
  try{
    transaction=pool.transaction();
    await transaction.begin();
    const request=transaction.request();

    let flag=false;
    for(let i=0;i<orderList.length;i++){
      this.checkStock(order.productId).then((result)=>{
        let newStock=result[0][0].stock-quantity;
        if(newStock<0){
          await transaction.rollback();
          flag=true;
        }else{
          await pool.request().query(`update products set stock ='${newStock}' where productId=${orderList.productId}`);
          this.getUserAddress(userId).then((result)=>{
            console.log(address);
            let address=result[0][0];
            let orderId=1;
            await pool.request.query(`insert into orders(orderId, productId, userId, quantity, price, billingAddress) values(${orderId}, ${orderList.productId}, ${orderList.userId}, ${quantity}, ${orderList.price}, '${address}')`);
          }).catch((err)=>{
            await transaction.rollback();
          })
        }
        if(flag===true){
          break;
        }
      })
    }
    await transaction.commit;
  }
  catch(err){
    await transaction.rollback();
  }
}

module.exports = {
  getUsers: getUsers,
  getUser: getUser,
  getUserByToken: getUserByToken,
  getUserByUserId: getUserByUserId,
  getUserByEmail: getUserByEmail,
  setUserVerified: setUserVerified,
  setUser: setUser,
  updateUser: updateUser,
  getProducts: getProducts,
  getProductById: getProductById,
  getnProducts: getnProducts,
  setProduct: setProduct,
  getCart: getCart,
  setCart: setCart,
  getCartByUserId: getCartByUserId,
  getCartByCartId: getCartByCartId,
  updateCartQuantity: updateCartQuantity,
  removeFromCart: removeFromCart,
  updatePassword: updatePassword,
  getSellerProducts: getSellerProducts,
  checkStock: checkStock,
  setUserAddress: setUserAddress,
  updateProductStock: updateProductStock,
  getUserAddress: getUserAddress
};
