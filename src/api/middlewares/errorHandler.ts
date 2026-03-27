import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Check for TypeORM query errors or other specific error types if needed
  // For now, a generic 500 response
  
  res.status(500).json({
    message: 'Ocorreu um erro interno no servidor.',
    error: err.message, // In development, you might want to send the error message
  });
};
