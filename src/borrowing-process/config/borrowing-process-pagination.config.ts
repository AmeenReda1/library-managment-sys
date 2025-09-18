import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { BorrowingProcess } from '../entities/borrowing-process.entity';
import { AppConfig } from 'src/config/config.schema';

export const BorrowingProcessPaginationConfig: PaginateConfig<BorrowingProcess> = {
    sortableColumns: ['id', 'borrowed_at', 'due_date', 'returned_at', 'created_at'],
    defaultSortBy: [['created_at', 'DESC']],
    searchableColumns: ['borrower.name', 'book.title', 'book.author'],
    filterableColumns: {
        isReturned: [FilterOperator.EQ],
        borrowed_at: [FilterOperator.GTE, FilterOperator.LTE],
        due_date: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.LT],
        returned_at: [FilterOperator.GTE, FilterOperator.LTE],
    },
    relations: ['borrower', 'book'],
    defaultLimit: AppConfig.PAGINATION_DEFAULT_LIMIT,
    maxLimit: AppConfig.PAGINATION_MAX_LIMIT,
};
