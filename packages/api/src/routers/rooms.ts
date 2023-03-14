import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cleanerProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const rooms = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.room.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { reviews: true },
        },
      },
    });
  }),
  findById: publicProcedure
    .input(z.number().int("Room id should be integer"))
    .query(({ input, ctx }) => {
      try {
        return ctx.prisma.room.findUniqueOrThrow({
          where: {
            id: input,
          },
          include: {
            plannedCleanings: {
              include: {
                cleaner: true,
              },
              orderBy: {
                from: "asc",
              },
            },
            reviews: true,
            actualCleanings: true,
            items: true
          },
        });
      } catch (error) {
        throw new TRPCError({
          message: `Cannot find room by id ${input}`,
          code: "NOT_FOUND",
          cause: error,
        });
      }
    }),
  add: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      groupId: z.number().int()
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.room.create({
        data: {
          title: input.title,
          roomGroup: {
            connect: {
              id: input.groupId
            }
          }
        }
      });
    }),
  deleteById: publicProcedure
    .input(z.number().int())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.room.delete({
        where: {
          id: input,
        },
      });
    }),
  addReview: publicProcedure
    .input(
      z.object({
        name: z.string(),
        text: z.string(),
        roomId: z.number().int(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.review.create({
        data: {
          ...input,
          createdAt: new Date(),
        },
      });
    }),
  startCleaning: cleanerProcedure
    .input(z.object({
      roomId: z.number().int()
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.actualCleaning.create({
        data: {
          room: {
            connect: {
              id: input.roomId
            }
          },
          startTime: new Date(),
          cleaner: {
            connect: {
              token: ctx.cleaner.token
            }
          }
        },
      });
    }),
  finishCleaning: publicProcedure
    .input(z.number().int())
    .mutation(async ({ input, ctx }) => {
      const cleaning = await ctx.prisma.actualCleaning.findUniqueOrThrow({
        where: {
          id: input,
        },
      });
      if (cleaning.finishTime !== null) {
        throw new TRPCError({
          message: "Cleaning already finished",
          code: "BAD_REQUEST",
        });
      }
      cleaning.finishTime = new Date();
      return await ctx.prisma.actualCleaning.update({
        where: {
          id: cleaning.id,
        },
        data: cleaning,
      });
    }),
  addHint: protectedProcedure
    .input(z.object({
      roomId: z.number().int(),
      itemId: z.number().int(),
    }))
    .mutation(({ input: { roomId, itemId }, ctx }) => {
      return ctx.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          items: {
            connect: {
              id: itemId
            }
          }
        }
      })
    })
});

export default rooms;
