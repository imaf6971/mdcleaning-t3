import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { writeFile } from 'fs/promises'
import { join } from 'path'

export function getUploadDir(subdir: string) {
  return join(
    process.env.ROOT_DIR ?? process.cwd(),
    `/public/uploads/${subdir}`
  )
}

const ITEM_IMG_UPLOAD_DIR = getUploadDir('items');

const item = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany();
  }),
  add: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      img: z.string(),
    }))
    .mutation(async ({ input: { title, description, img }, ctx }) => {
      const decodedImg = decodeBase64Image(img);

      const FILE_NAME = `${Date.now()}.${decodedImg.type}`;
      const photoPath = `${ITEM_IMG_UPLOAD_DIR}/${FILE_NAME}`;
      await writeFile(photoPath, decodedImg.data)

      return ctx.prisma.item.create({
        data: {
          title,
          description,
          photoPath: FILE_NAME
        }
      })
    })
})

function decodeBase64Image(data: string) {
  const matched = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

  if (matched?.length !== 3) {
    throw new Error('Invalid input string')
  }

  const type = matched[1]?.match(/\/(.*?)$/)?.[1];
  if (type === undefined) {
    throw new Error('Oce pogano')
  }
  return {
    type,
    data: Buffer.from(matched[2] as string, 'base64'),
  }
}

export default item;
