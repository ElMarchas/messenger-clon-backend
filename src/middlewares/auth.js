import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; //el ? ejecuta el split si existe el header, pa quitar el bearer del array
    if (!token) {
      return res.send("valio barriga, no token"); //("Authentication failed!");
    }
    const verified = jwt.verify(token, "pitos");
    req.verifiedUser = verified;
    console.log(verified.user.nickName);
  } catch (error) {
    //console.log(error);
    return res.send("valio barriga");
  }

  next();
};

export default authenticate;
