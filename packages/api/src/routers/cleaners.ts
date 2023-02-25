import { z } from "zod";
import { publicProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

const cleaners = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.cleaner.findMany({
      select: {
        id: true,
        lastName: true,
        firstName: true,
      },
    });
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
  .mutation(({input, ctx}) => {
    return ctx.prisma.cleaner.delete({
      where: {
        id: input.id
      }
    })
  })
});

export default cleaners;
