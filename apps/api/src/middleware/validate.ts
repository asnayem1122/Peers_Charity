import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AcademicMetadataSchema, ResourceQuerySchema } from '@peers-charity/shared';

export const validateRequest = (schema: {
  body?: AnyZodObject | any;
  query?: AnyZodObject | any;
  params?: AnyZodObject | any;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      return next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Validation failed',
          issues: error.issues,
          errors: error.format ? error.format() : undefined,
        });
      }
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid request',
      });
    }
  };
};

/**
 * Validates the academicMetadata of resource creation requests at the HTTP boundary.
 * Handles both JSON body and multipart form body where academicMetadata is a serialized JSON string.
 */
export const validateResourceCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let academicMetadata = req.body.academicMetadata;

    if (typeof academicMetadata === 'string') {
      try {
        academicMetadata = JSON.parse(academicMetadata);
      } catch (e) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Invalid JSON format for academicMetadata',
          issues: [
            {
              code: 'custom',
              path: ['academicMetadata'],
              message: 'academicMetadata must be a valid JSON object',
            },
          ],
        });
      }
    }

    if (!academicMetadata) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validation failed: academicMetadata is required',
        issues: [
          {
            code: 'custom',
            path: ['academicMetadata'],
            message: 'academicMetadata is required',
          },
        ],
      });
    }

    // Validate against AcademicMetadataSchema
    const parsed = await AcademicMetadataSchema.parseAsync(academicMetadata);
    req.body.academicMetadata = parsed;

    return next();
  } catch (error: any) {
    if (error instanceof ZodError || error?.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        issues: error.issues,
        errors: error.format ? error.format() : undefined,
      });
    }
    return next(error);
  }
};

/**
 * Validates resource query parameters for GET /api/resources
 */
export const validateResourceQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedQuery = await ResourceQuerySchema.parseAsync(req.query);
    req.query = parsedQuery as any;
    return next();
  } catch (error: any) {
    if (error instanceof ZodError || error?.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid query parameters',
        issues: error.issues,
        errors: error.format ? error.format() : undefined,
      });
    }
    return next(error);
  }
};
