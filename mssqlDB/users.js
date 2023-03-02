//Class to represent the user table

class users {
  constructor(Id, firstName, lastName, email, password, phoneNumber, address) {
    this.Id = Id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.verifiedUser = verifiedUser;
    this.token = token;
  }
}

module.exports = users;
