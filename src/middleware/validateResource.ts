import { Express, NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validate =
  (schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
    } catch (e: any) {
      res.status(400).send(e.errors);
    }
    next();
  };

export default validate;
