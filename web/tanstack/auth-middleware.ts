import { getAuth } from "@clerk/tanstack-react-start/server";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getAuth(getWebRequest()!);

  if (!user?.userId) {
    throw new Error("Unauthorized");
  }

  const result = await next({
    context: {
      userId: user.userId,
    },
  });

  return result;
});

export default authMiddleware;
