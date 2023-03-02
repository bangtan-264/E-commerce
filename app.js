const express = require("express");
const fs = require("fs");
const session = require("express-session");
const multer = require("multer");
const port = 3000;
const app = express();
const cors = require("cors");
const upload = multer({ dest: "uploads/" });
const checkAuth = require("./middlewares/checkAuth");
const sendEmail = require("./methods/sendEmail");
const userMethods = require("./methods/userMethods");
const productMethods = require("./methods/productMethods");
let db = require("./mssqlDB/dboperations");
require("dotenv").config();
const dboperations = require("./mssqlDB/dboperations");

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);

// dboperations
//   .getCart2(2, 6)
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.set("view engine", "ejs");

// app.route("/").get(checkAuth, (req, res) => {
app.route("/").get((req, res) => {
  dboperations.getnProducts(0, 5).then((result) => {
    if (result.length !== 0) {
      if (req.session.is_logged_in) {
        console.log("Is logged In");
        let username = req.session.username;
        res.render("home", {
          hasAccount: true,
          account: username,
          products: result[0],
        });
      } else {
        console.log("Not logged In");
        res.render("home", {
          hasAccount: false,
          account: "My Account",
          products: result[0],
        });
      }
    } else {
      console.log("Products not available");
    }
  });
});

app
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post((req, res) => {
    let hasAccount = false;
    let email = req.body.email;

    let userData = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phonenumber,
      address: JSON.stringify({ address: [] }),
      isVerified: 0,
      mailToken: Date.now(),
      status: 0,
    };

    dboperations
      .getUser(userData)
      .then((result) => {
        if (result[0].length === 0) {
          dboperations.setUser(userData).then((result) => {
            const subject = "Account Verification mail from E-commerce";
            const html = `<h3> Dear ${userData.firstName} ${userData.lastName}, Please click on the given link to verify your account <a href="http://localhost:3000/verifyMail/${userData.mailToken}"> Verify Me!</a></h3><br/>`;

            sendEmail(email, subject, html, (err, data) => {
              console.log("Send email");
              req.session.is_logged_in = true;
              req.session.username =
                userData.firstName + " " + userData.lastName;
              req.session.userType = 0;
              res.end("Success");
            });
          });
        } else {
          res.end("isUser");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    console.log(req.body);

    //Authentication --> Match username and password from db or in file
    let loginInfo = req.body;
    let email = loginInfo["email"];
    let password = loginInfo["password"];

    dboperations
      .getUser(loginInfo)
      .then((result) => {
        console.log(result, result[0][0]);
        if (result[0].length === 0) {
          console.log("User doesn't exist");
          res.json({ res: "Failure" });
        } else {
          req.session.is_logged_in = true;
          req.session.isVerified = true;
          req.session.username =
            result[0][0].firstName + " " + result[0][0].lastName;
          req.session.userId = result[0][0].userId;
          req.session.userType = result[0][0].status;
          res.json({ res: "Success" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

app.route("/logout").get((req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/verifyMail/:token", (req, res) => {
  const { token } = req.params;
  console.log(token);

  dboperations.getUserByToken(token).then((result) => {
    if (result[0].length !== 0) {
      console.log("Matched");
      req.session.isVerified = true;
      req.session.userId = result[0][0].userId;
      dboperations.setUserVerified(token).then((result) => {
        console.log("Verified user");
        res.redirect("/");
      });
    }
  });
});

app.get("/sentEmailPage", (req, res) => {
  res.render("sentEmailPage", {
    text: "An activation email has been sent to your registered email Id.",
  });
});

app.route("customer").get((req, res) => {});

app.route("/seller").get(checkAuth, (req, res) => {
  if (req.session.userType === 1) {
    if (req.session.is_logged_in) {
      let username = req.session.username;
      res.render("seller", {
        hasAccount: true,
        account: username,
      });
    } else {
      res.render("seller", {
        hasAccount: false,
        account: "My Account",
      });
    }
  } else {
    res.render("sellerLogin");
  }
});

app
  .route("/sellerSignup")
  .get((req, res) => {
    res.render("sellerSignup");
  })
  .post((req, res) => {
    let hasAccount = false;
    let email = req.body.email;

    let sellerData = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phonenumber,
      address: JSON.stringify({ address: [req.body.address] }),
      isVerified: 0,
      mailToken: Date.now(),
      status: 1,
    };

    dboperations
      .getUser(sellerData)
      .then((result) => {
        if (result[0].length === 0) {
          console.log("New seller");
          dboperations.setUser(sellerData).then((res) => {
            const subject = "Account Verification mail from E-commerce";
            const html = `<h3> Dear ${sellerData.firstName} ${sellerData.lastName}, Please click on the given link to verify your account <a href="http://localhost:3000/verifyMail/${sellerData.mailToken}"> Verify Me!</a></h3><br/>`;
            sendEmail(email, subject, html, (err, data) => {
              console.log("Successfully written file");
              req.session.is_logged_in = true;
              req.session.username =
                sellerData.firstName + " " + sellerData.lastName;
              req.session.isVerified = true;
              req.session.userType = 1;
              res.json({ res: "Success" });
            });
          });
        } else if (result[0][0].status === 0) {
          console.log("User wants to become a seller");
          dboperations.updateUser(sellerData, 1).then((result) => {
            req.session.is_logged_in = true;
            req.session.username =
              result[0][0].firstName + " " + result[0][0].lastName;
            req.session.isVerified = true;
            res.json({ res: "Success" });
          });
        } else {
          console.log("IS a seller");
          res.json({ res: "isUser" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

app
  .route("/sellerLogin")
  .get((req, res) => {
    res.render("sellerLogin");
  })
  .post((req, res) => {
    //Authentication --> Match username and password from db or in file
    let loginInfo = req.body;
    let email = loginInfo["email"];
    let password = loginInfo["password"];

    dboperations
      .getUser(loginInfo)
      .then((result) => {
        if (result[0].length === 0) {
          console.log("User doesn't exist");
          res.json({ res: "Failure" });
        } else if (result[0][0].status == 0) {
          console.log("User doesn't exist");
          res.json({ res: "Failure" });
        } else {
          req.session.is_logged_in = true;
          req.session.isVerified = true;
          req.session.username =
            result[0][0].firstName + " " + result[0][0].lastName;
          req.session.userId = result[0][0].userId;
          req.session.userType = result[0][0].status;
          console.log(req.session.userId);
          res.json({ res: "Success" });
          // return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

app.route("/sellerLogout").get((req, res) => {
  req.session.destroy();
  res.redirect("/seller");
});

app
  .route("/addProduct")
  .get((req, res) => {
    let userId = req.session.userId;
    dboperations
      .getSellerProducts(userId)
      .then((result) => {
        console.log(result);
        if (result[0].length !== 0) {
          res.json({ res: result[0] });
        } else {
          res.json({ res: "No products" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .post(upload.single("productImage"), (req, res) => {
    let product = {
      productName: req.body.productName,
      price: req.body.price,
      productDesc: req.body.productDesc,
      stock: req.body.productStock,
      productImage: req.file.filename,
      sellerId: req.session.userId,
    };

    dboperations
      .setProduct(product)
      .then((result) => {
        console.log("Product added successfully");
        res.send({ res: "Success", img: product.productImage });
      })
      .catch((err) => {
        console.log(err);
      });
  });

app
  .route("/forgotPassword")
  .get((req, res) => {
    res.render("forgotPassword", { forgotInfo: " " });
  })
  .post((req, res) => {
    let email = req.body.email;

    dboperations.getUserByEmail(email).then((result) => {
      console.log(result);
      if (result[0].length !== 0) {
        console.log("email exists");
        const subject = "Password reset for E-commerce";
        const html = `<h3>Dear ${
          result[0][0].firstName + " " + result[0][0].lastName
        }, Please click on the given link to reset your password <a href="http://localhost:3000/forgotPassword/${
          result[0][0].token
        }"> Reset Password!</a></h3><br/>`;

        sendEmail(email, subject, html, (err, data) => {
          res.render("sentEmailPage", {
            text: "A reset password email has been sent to your registered email Id",
          });
        });
      } else {
        console.log("wrong email");
        res.render("forgotPassword", {
          forgotInfo: "Entered email id doesn't exist.",
        });
      }
    });
  });

app.get("/forgotPassword/:token", (req, res) => {
  console.log(req.body);
  const { token } = req.params;
  console.log(token);

  dboperations.getUserByToken(token).then((result) => {
    if (result[0].length !== 0) {
      req.session.userId = result[0][0].userId;
      res.redirect("/changePassword");
    }
  });
});

app
  .route("/changePassword")
  .get((req, res) => {
    if (req) res.render("changePassword", { changeInfo: " " });
  })
  .post((req, res) => {
    let newPassword = req.body.newPassword.trim();
    let confirmPassword = req.body.confirmPassword.trim();

    if (!(newPassword && confirmPassword)) {
      res.render("changePassword", {
        changeInfo: "Please enter password in correct format.",
      });
    } else {
      if (newPassword != confirmPassword) {
        res.render("changePassword", {
          changeInfo: "New password doesn't match confirm Password.",
        });
      } else {
        let userId = req.session.userId;
        dboperations.getUserByUserId(userId).then((result) => {
          if (result[0].lenght !== 0) {
            let username = result[0][0].firstName + " " + result[0][0].lastName;
            let email = result[0][0].email;
            dboperations.updateUser(newPassword, userId).then((result) => {
              const subject = "Password reset for E-commerce";
              const html = `<h3>Dear ${username}, Your password has been successfully changed.</h3><br/>`;
              sendEmail(email, subject, html, (err, data) => {
                console.log("Successfully Changed Password");
                res.redirect("/");
              });
            });
          }
        });
      }
    }
  });

app.route("/getUserInfo").get((req, res) => {
  fs.readFile(__dirname + "/userDb.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Error...");
    } else {
      let users;
      if (data.length === 0) {
        users = [];
      } else {
        users = JSON.parse(data);
      }
      res.json(users);
    }
  });
});

app.route("/showProducts").post((req, res) => {
  let start = req.body.index;
  dboperations.getnProducts(start).then((result) => {
    if (result[0].length === 0) {
      console.log("Products not available");
    } else {
      res.json({ products: result[0] });
    }
  });
});

app.route("/productInfo").post((req, res) => {
  let productId = req.body.id;
  dboperations.getProductById(productId).then((result) => {
    if (result[0].length === 0) {
      console.log("Products not available");
    } else {
      res.json({ product: result[0] });
    }
  });
});

app.route("/getCart").get((req, res) => {
  if (req.session.is_logged_in && req.session.isVerified) {
    res.json({ res: 1 });
  } else {
    res.json({ res: -1 });
  }
});

app.route("/getCartItems").get((req, res) => {
  dboperations.getCartByUserId(req.session.userId).then((result) => {
    console.log(result);
    if (result.length !== 0) {
      res.json({ res: result[0] });
    } else {
      res.json({ res: 0 });
    }
  });
});

app
  .route("/cart")
  .get((req, res) => {
    let username = req.session.username;
    res.render("cart", {
      hasAccount: true,
      account: username,
    });
  })
  .post((req, res) => {
    console.log(req.body);
    dboperations
      .getCart(req.session.userId, req.body.productId)
      .then((result) => {
        let cart;
        if (result[0].length === 0) {
          cart = {
            userId: req.session.userId,
            productId: req.body.productId,
            quantity: 1,
          };

          dboperations.setCart(cart).then((result) => {
            res.json({ res: "Success" });
          });
        } else {
          let cartId = result[0][0].cartId;
          let quantity = result[0][0].quantity + 1;
          // let price = result[0][0].price;

          if (quantity <= result[0][0].stock) {
            dboperations.updateCartQuantity(cartId, quantity).then((result) => {
              res.json({ res: "Success" });
            });
          } else {
            res.json({ res: "Out of Stock" });
          }
        }
      });
  });

app.route("/cartQuantity").post((req, res) => {
  let cartInfo = req.body;
  dboperations
    .getCart(req.session.userId, cartInfo.productId)
    .then((result) => {
      console.log(result);
      let quantity = result[0][0].quantity + cartInfo.quantity;
      let price = result[0][0].price;

      if (quantity <= result[0][0].stock) {
        if (quantity == 0) {
          res.json({ res: "empty", cartId: result[0][0].cartId });
        } else {
          let cartId = result[0][0].cartId;

          dboperations.updateCartQuantity(cartId, quantity).then((result) => {
            res.json({ quantity: quantity, price: price });
          });
        }
      } else {
        res.json({ res: "Out of stock" });
      }
    });
});

app.route("/removeFromCart").post((req, res) => {
  let cartId = req.body.cartId;
  console.log(cartId);
  dboperations
    .removeFromCart(cartId)
    .then((result) => {
      console.log(result);
      res.json({ res: "Success" });
    })
    .catch((error) => {
      res.json({ res: "Failure" });
    });
});

app
  .route("/orderType")
  .get((req, res) => {
    let orderType = req.session.orderType;
    let userId = req.session.userId;

    if (orderType === "cartList") {
      console.log("cartList");
      dboperations.getCartByUserId(userId).then((result) => {
        console.log(result[0]);
        res.json({ res: result[0] });
      });
    } else if (orderType === "cartItem") {
      let cartId = req.session.cartId;
      dboperations.getCartByCartId(cartId).then((result) => {
        console.log(result[0]);
        res.json({ res: result[0] });
      });
    } else if (orderType === "product") {
      let productId = req.session.productId;
      dboperations.getProductById(productId).then((result) => {
        if (result[0][0].stock > 0) {
          let product = {
            productName: result[0][0].productName,
            productImage: result[0][0].productImage,
            price: result[0][0].price,
            productDesc: result[0][0].productDesc,
            quantity: 1,
          };
          res.json({ res: [product] });
        } else {
          res.json({ res: "Out of Stock" });
        }
      });
    } else {
      res.json({ res: "Failure" });
    }
  })
  .post((req, res) => {
    let orderType = req.body.orderType;
    req.session.orderType = orderType;

    if (orderType === "cartList") {
      res.json({ res: "Success" });
    } else if (orderType === "cartItem") {
      let cartId = req.body.cartId;
      req.session.cartId = cartId;
      res.json({ res: "Success" });
    } else if (orderType === "product") {
      let productId = req.body.productId;
      req.session.productId = productId;
      res.json({ res: "Success" });
    } else {
      res.json({ res: "Failure" });
    }
  });

app
  .route("/orders")
  .get((req, res) => {
    res.render("orders");
  })
  .post((req, res) => {});

app.route("/userAddress").post((req, res) => {
  let userId = req.session.userId;
  console.log(userId);
  let address = JSON.stringify({ address: [req.body.address] });
  dboperations
    .setUserAddress(address, userId)
    .then((result) => {
      console.log(result);
      res.json({ res: "Success" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log("App is listening at port " + port);
});
