import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default (req: any, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded: any = jwt.verify(token, "secret");
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(403).json({
        message: "Invalid token",
      });
    }
  } else {
    res.status(403).json({
      message: "Invalid token",
    });
  }
};
