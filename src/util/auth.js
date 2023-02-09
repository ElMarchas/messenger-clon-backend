import jwt from "jsonwebtoken";

const createJWTToken = (user) => {
  return jwt.sign({ user }, "pitos", {
    //el user lo pasamos como objeto {user} pa que no chille pitos es la palabra secreta
    expiresIn: "1d",
  });
};

export { createJWTToken };
