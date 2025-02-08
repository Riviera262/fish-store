import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

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
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: 'Invalid token' })
        return // đảm bảo trả về undefined
      }
      req.user = decoded as JwtPayload
      next()
    })
  } else {
    res.status(401).json({ error: 'No token provided' })
    return // trả về void
  }
}

export const adminOnly: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ error: 'Admin privileges required' })
    return
  }
}
