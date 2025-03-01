import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

interface JwtPayload {
  id: number
  role: string
}

export const authenticateToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Lấy token từ cookie
  const token = req.cookies.token

  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err: VerifyErrors | null, decoded: unknown) => {
      if (err) {
        res.status(403).json({ error: 'Invalid token' })
        return
      }
      req.user = decoded as JwtPayload
      next()
    }
  )
}

export const adminOnly: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && (req.user as JwtPayload).role === 'admin') {
    next()
  } else {
    res.status(403).json({ error: 'Admin privileges required' })
    return
  }
}
