function checkAuth(req, res, next) {
  if (req.session.is_logged_in && !req.session.isVerified) {
    res.redirect("/sentEmailPage");
  } else {
    next();
    return;
  }
}

module.exports = checkAuth;
