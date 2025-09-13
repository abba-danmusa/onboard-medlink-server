// Example middleware: logs request method and URL
module.exports = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
