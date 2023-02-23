import { prisma } from "@acme/db";
import { NextApiHandler } from "next";
import { parseForm } from "~/utils/parse-form";

export const config = {
  api: {
    bodyParser: false,
  },
};

const createCleaningPhotoInDb = async (
  cleaningId: number,
  filename: string,
) => {
  await prisma.cleaningPhotos.create({
    data: {
      path: filename,
      actualCleaningId: cleaningId,
    },
  });
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    console.log("Photo upload is not a PATCH method");
    res.setHeader("Allow", "POST");
    res.status(405).json({
      data: null,
      error: "Method not allowed",
    });
    return;
  }
  const cleaningId = parseInt(req.query.id as string);
  const { files } = await parseForm(req);
  for (const fileName in files) {
    const fileObj = files[fileName];
    if (fileObj === undefined) {
      continue;
    }
    console.log(fileObj);
    if (Array.isArray(fileObj)) {
      fileObj.forEach((file) => {
        void createCleaningPhotoInDb(cleaningId, file.newFilename);
      });
      return;
    }
    void createCleaningPhotoInDb(cleaningId, fileObj.newFilename);
  }
  res.json({ ok: true });
};

export default handler;
