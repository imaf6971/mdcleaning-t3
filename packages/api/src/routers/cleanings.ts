import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const cleanings = createTRPCRouter({
  byId: publicProcedure.input(z.number().int()).query(({ input, ctx }) => {
    return ctx.prisma.actualCleaning.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        cleaningPhotos: true,
        room: true,
      },
    });
  }),
});

export default cleanings;
