const errorLogger = (error, res, status) => {
  console.error("\n///////////// ERROR /////////////\n", error, "\n");
  res.status(status).send("Ocurrió un error.");
};

module.exports = errorLogger;
