import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader !== 'Bearer my-secret-token') {
      throw new UnauthorizedException('Unauthorized Access');
    }

    next(); 
  }
}
