export const errorLogger = (error, alertMessage) => {
  if (error.code) console.log("ERROR CODE", error.code);
  if (error.message) console.log("ERROR MESSAGE", error.MESSAGE);
  console.log(error);

  switch (alertMessage) {
    case 1:
      alert("Usuario incorrecto.");
      break;
    default:
      alert("Ocurrió un error.");
  }
};
