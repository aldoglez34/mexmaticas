export const errorLogger = (error, alertType) => {
  console.log({ error });

  switch (alertType) {
    case 1:
      alert("Ocurrió un error.");
      break;
    default:
      alert("Ocurrió un error.");
  }
};
