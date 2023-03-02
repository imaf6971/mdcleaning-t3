import { createTRPCRouter, publicProcedure } from "../trpc";

const item = createTRPCRouter({
  list: publicProcedure.query(({ctx}) => {
    return ctx.prisma.item.findMany();
  })
})

export default item;
