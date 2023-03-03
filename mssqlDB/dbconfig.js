//Configuration to connect to mssql

var config = {
  user: "sahilVerma",
  password: "2642",
  server: "localhost",
  database: "ecommerce_db",
  options: {
    trustServerCertificate: true,
    trustedconnection: true,
    enableArithAbort: true,
    instancename: "SQLEXPRESS",
  },
  // port: 1433,
};

module.exports = config;
