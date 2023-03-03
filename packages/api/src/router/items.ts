import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const item = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany();
  }),
  add: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1)
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.item.create({
        data: input
      })
    })
})

export default item;
