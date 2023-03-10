import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const clients = createTRPCRouter({
  list: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.client.findMany();
    }),
  byId: protectedProcedure
    .input(z.object({
      id: z.number().int()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.client.findUniqueOrThrow({
        where: input,
        include: {
          roomGroups: {
            include: {
              rooms: true
            }
          }
        }
      })
    }),
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1)
    })).mutation(({ ctx, input }) => {
      return ctx.prisma.client.create({
        data: input
      })
    }),
  createRoomGroup: protectedProcedure
    .input(z.object({
      roomId: z.number().int(),
      roomGroupTitle: z.string().min(1),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.roomGroup.create({
        data: {
          title: input.roomGroupTitle,
          client: {
            connect: {
              id: input.roomId
            }
          }
        }
      })
    })

})

export default clients;
