import { appRouter, createInnerTRPCContext } from "@acme/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
// import superjson from "superjson";
import transformer from "@acme/api/transformer";

export const createSSG = () =>
  createProxySSGHelpers({
    transformer,
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
  });
