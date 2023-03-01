import jwt from "jsonwebtoken";
//AUTENTICACION CON COOKIES
const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.tokenSerialized; //el ? ejecuta el split si existe el header, pa quitar el bearer del array
    if (!token) {
      return res.status(401).send("valio barriga, no token"); //("Authentication failed!");
    }
    const verified = jwt.verify(token, "pitos");
    req.verifiedUser = verified;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).send(error.message);
  }
};

export default authenticate;

/* AUTENTICACION CON HEADERS AUTH
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; //el ? ejecuta el split si existe el header, pa quitar el bearer del array
    if (!token) {
      return res.send("valio barriga, no token"); //("Authentication failed!");
    }
    const verified = jwt.verify(token, "pitos");
    req.verifiedUser = verified;
    console.log(verified.user.nickName);
    next();
  } catch (error) {
    console.log(error.message);
    return res.send(error.message);
  }
};
*/
