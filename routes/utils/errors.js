const errorLogger = (error, res, status) => {
  console.log("\n///////////// ERROR /////////////\n", error, "\n");
  res.status(status).send("Ocurrió un error.");
};

module.exports = errorLogger;
