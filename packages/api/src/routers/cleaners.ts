import { z } from "zod";
import { publicProcedure, createTRPCRouter, protectedProcedure, cleanerProcedure } from "../trpc";

const cleaners = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.cleaner.findMany();
  }),
  add: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        patronymic: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cleaner.create({
        data: input,
      });
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number().int()
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.cleaner.delete({
        where: {
          id: input.id
        }
      })
    }),
  me: cleanerProcedure.query(({ ctx: { cleaner } }) => cleaner)
});

export default cleaners;
