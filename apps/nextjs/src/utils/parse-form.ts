import formidable from "formidable";
import { mkdir, stat } from "fs/promises";
import * as mime from "mime";
import { NextApiRequest } from "next";
import { join } from "path";

export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const uploadDir = join(
    process.env.ROOT_DIR || process.cwd(),
    `/public/uploads`,
  );

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(e);
      throw e;
    }
  }

  const form = formidable({
    maxFiles: 2,
    maxFileSize: 1024 * 1024, // 1mb
    uploadDir,
    filename: (_name, _ext, part) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${part.name || "unknown"}-${uniqueSuffix}.${
        mime.getExtension(part.mimetype || "") || "unknown"
      }`;
      return filename;
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};
