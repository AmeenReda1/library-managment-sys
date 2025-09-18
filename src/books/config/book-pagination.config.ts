import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Book } from '../entities/book.entity';
import { AppConfig } from 'src/config/config.schema';

export const BookPaginationConfig: PaginateConfig<Book> = {
    sortableColumns: ['id', 'title', 'author', 'created_at'],
    defaultSortBy: [['created_at', 'DESC']],
    searchableColumns: ['title', 'author', 'ISBN', 'shelf_location'],
    filterableColumns: {
        shelf_location: [FilterOperator.EQ, FilterOperator.CONTAINS],
        author: [FilterOperator.EQ, FilterOperator.CONTAINS],
        ISBN: [FilterOperator.EQ, FilterOperator.CONTAINS],
        available_quantity: [FilterOperator.GTE, FilterOperator.LTE],
    },
    defaultLimit: AppConfig.PAGINATION_DEFAULT_LIMIT,
    maxLimit: AppConfig.PAGINATION_MAX_LIMIT,
};
