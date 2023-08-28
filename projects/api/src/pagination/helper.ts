import { SelectQueryBuilder } from "typeorm";
import { PaginatedList } from "./types";

export async function paginate<T>(
  query: SelectQueryBuilder<T>,
  { current, pageSize },
  opts?: { raw?: boolean }
): Promise<PaginatedList<T>> {
  current = current || 1;
  pageSize = pageSize || 20;
  const total = await query.getCount();
  const offset = (current - 1) * pageSize;
  const data = query.limit(pageSize).offset(offset);
  return {
    total,
    data: opts?.raw ? await data.getRawMany() : await data.getMany(),
  };
}
