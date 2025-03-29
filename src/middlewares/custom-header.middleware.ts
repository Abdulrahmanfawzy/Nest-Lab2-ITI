import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CustomHeaderMiddleware implements NestMiddleware {
  private readonly expectedValue: string;

  constructor() {
    // Get the value from environment variables
    const envValue = process.env.CUSTOM_HEADER;
    
    // Throw error if not set (before assignment)
    if (!envValue) {
      throw new Error('CUSTOM_HEADER environment variable is not set');
    }

    // Now we can safely assign since we've checked it's not undefined
    this.expectedValue = envValue;
  }

  use(req: Request, res: Response, next: NextFunction) {
    const customHeaderValue = req.headers['custom-header'];
    
    if (!customHeaderValue) {
      throw new UnauthorizedException({
        message: 'Missing custom-header',
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    if (customHeaderValue !== this.expectedValue) {
      throw new UnauthorizedException({
        message: 'Invalid custom-header value',
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    next();
  }
}