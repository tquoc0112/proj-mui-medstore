// proj-backend/types/express.d.ts
import "multer";

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
      authUser?: { id: number; role: any; email: string; status: any };
    }
  }
}

export {};
