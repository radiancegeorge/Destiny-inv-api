import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  username: string;
  walletAddress: string;
  email: string;
}
// declare global {
//   namespace Express {
//     interface Request {
//       user: User;
//     }
//   }
// }

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is sent in the Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Token is valid, you can access the decoded payload
    (req as any).user = decoded; // Assign the decoded payload to the request object

    next(); // Call the next middleware or route handler
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ message: "Invalid token" });
  }
};
