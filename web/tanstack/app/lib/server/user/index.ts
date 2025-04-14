import { getAuth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

export const getUserId = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getAuth(getWebRequest()!);
  return user?.userId;
});
