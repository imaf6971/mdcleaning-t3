import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import cleaners from "./routers/cleaners";
import cleaningPlan from "./routers/cleaningPlan";
import rooms from "./routers/rooms";
import cleanings from "./routers/cleanings"; 
import item from './router/items'
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  cleaners,
  rooms,
  cleaningPlan,
  cleanings,
  item,
});

// export type definition of API
export type AppRouter = typeof appRouter;
