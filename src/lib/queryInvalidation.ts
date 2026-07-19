import { QueryClient } from "@tanstack/react-query";

export function invalidateRootQueries(
  queryClient: QueryClient,
  roots: string[],
) {
  return queryClient.invalidateQueries({
    predicate: (query) => roots.includes(String(query.queryKey[0])),
  });
}
