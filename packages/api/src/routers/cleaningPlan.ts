import { z } from "zod";
import { publicProcedure, createTRPCRouter, cleanerProcedure } from "../trpc";

const cleaningPlan = createTRPCRouter({
  deleteById: publicProcedure
    .input(z.number().int())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.cleaningPlan.delete({
        where: {
          id: input,
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        roomId: z.number().int(),
        from: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        to: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        cleanerId: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newCleaning = await ctx.prisma.cleaningPlan.create({
        data: input,
      });
      return newCleaning;
    }),
  get: cleanerProcedure.query(({ ctx }) => {
    return ctx.prisma.cleaningPlan.findMany({
      where: {
        cleaner: {
          id: ctx.cleaner.id
        }
      }
    })
  })
});

export default cleaningPlan;
