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
async function getCartId() {
  try {
    let pool = await sql.connect(config);
    let cartId = await pool
      .request()
      .query(
        `select cartId from cart order by cartId desc offset 0 rows fetch next 1 rows only`
      );
    return cartId.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getItemsByUserId(userId) {
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

async function getItemByCartId(cartId) {
  try {
    let pool = await sql.connect(config);
    let cartItem = await pool
      .request()
      .query(
        `select cart.cartId, cart.quantity, products.* from cart inner join products on cart.productId = products.productId and cart.cartId= ${cartId}`
      );
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

async function getUserAddress(userId) {
  try {
    let pool = await sql.connect(config);
    let address = await pool.request.query(
      `get address from users where userId=${userId}`
    );
    return address;
  } catch (err) {
    console.log(err);
  }
}

async function placeOrder(orderList) {
  // async function placeOrder(productId) {
  let errors = [];
  let pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  transaction.begin(async (err) => {
    let rolledBack = false;

    transaction.on("rollback", (aborted) => {
      console.log("rolledback");
    });
    for (let i = 0; i < orderList.length; i++) {
      let oldStock = 0;
      let newStock = 0;
      const request = new sql.Request(transaction);
      request.query(
        `select stock from products where productId=${orderList[i].productId}`,
        async (err, result) => {
          console.log("result q1", result);
          if (err) {
            console.log("error 1");
            errors.push(err);
            if (!rolledBack) {
              console.log("rollback 1 below");
              await transaction.rollback((err) => {
                console.log("rolling back 1");
              });
            }
          } else if (result.recordset[0].stock - orderList[i].quantity < 0) {
            await transaction.rollback((err) => {
              console.log("rolling back quantity is less");
            });
          } else {
            oldStock = result.recordset[0].stock;
            console.log("oldStock", oldStock);
            newStock = oldStock - orderList[i].quantity;
            console.log(
              "oldstock",
              oldStock,
              "quantity",
              orderList[i].quantity
            );
            console.log("new stock", newStock);

            const request2 = new sql.Request(transaction);
            request2.query(
              `update products set stock =${newStock} where productId=${orderList[i].productId}`,
              async (err, result) => {
                console.log("query2 res ", result);
                if (err) {
                  console.log("error 2");
                  errors.push(err);
                  if (!rolledBack) {
                    console.log("rollback 2 below");
                    await transaction.rollback((err) => {
                      console.log("rolling back 2");
                    });
                  }
                }
                let orderId = 2;
                const request4 = new sql.Request(transaction);
                request4.query(
                  `insert into orders(orderId, productId, userId, quantity, price, billingAddress) values(${orderId}, ${orderList[i].productId}, ${orderList[i].userId}, ${orderList[i].quantity}, ${orderList[i].price}, '${orderList[i].address}')`,
                  async (err, result) => {
                    if (err) {
                      console.log("error 3");
                      errors.push(err);
                      if (!rolledBack) {
                        console.log("rollback 3 below");
                        await transaction.rollback((err) => {
                          console.log("rolling back 3");
                        });
                      }
                    }
                    transaction.commit((err) => {
                      if (err) {
                        console.log(errors);
                        console.log("error in committing transaction");
                        return JSON.stringify({ res: "error" });
                        // console.log(err);
                      } else {
                        console.log("Success");
                        return JSON.stringify({ res: "Success" });
                      }
                    });
                  }
                );
              }
            );
          }
        }
      );
    }
  });
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
  getItemsByUserId: getItemsByUserId,
  getItemByCartId: getItemByCartId,
  updateCartQuantity: updateCartQuantity,
  removeFromCart: removeFromCart,
  updatePassword: updatePassword,
  getSellerProducts: getSellerProducts,
  checkStock: checkStock,
  setUserAddress: setUserAddress,
  getUserAddress: getUserAddress,
  placeOrder: placeOrder,
  getCartId: getCartId,
};
