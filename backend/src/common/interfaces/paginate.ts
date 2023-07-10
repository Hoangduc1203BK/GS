import { DEFAULT_PAGING } from '../constants/paging';
export const paginate = (total: number, page = DEFAULT_PAGING.PAGE, limit = DEFAULT_PAGING.LIMIT, maxPages: number) => {
	const totalPages = Math.ceil(total / page);
	return {
		page,
		perPage: limit,
		totalPages,
		total,
		prev: page > 1 ? page - 1 : undefined,
		next: page < totalPages ? Number(page) + 1 : undefined,
		maxPages: Math.ceil(maxPages/limit),
	};
};
