import { PaginationParamsDTO } from "../dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../dto/common/PaginatedResponseDTO.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export function parsePaginationQuery(query: Record<string, unknown>): PaginationParamsDTO & { search: string; sort: string } {
  const rawPage = Number(query.page);
  const rawLimit = Number(query.limit);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const normalizedLimit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : DEFAULT_LIMIT;
  const limit = Math.min(normalizedLimit, MAX_LIMIT);

  const search = typeof query.search === "string" ? query.search.trim() : "";
  const sort = query.sort === "desc" ? "desc" : "asc";

  return { page, limit, search, sort };
}

export function paginateArray<T>(items: T[], pagination: PaginationParamsDTO): PaginatedResponseDTO<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
  const page = Math.min(pagination.page, totalPages);
  const start = (page - 1) * pagination.limit;
  const end = start + pagination.limit;

  return {
    data: items.slice(start, end),
    pagination: {
      page,
      limit: pagination.limit,
      total,
      totalPages,
    },
  };
}
