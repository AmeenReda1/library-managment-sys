import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { User } from '../entities/user.entity';
import { AppConfig } from 'src/config/config.schema';

export const UserPaginationConfig: PaginateConfig<User> = {
    sortableColumns: ['id', 'name', 'email', 'created_at'],
    defaultSortBy: [['created_at', 'DESC']],
    searchableColumns: ['name', 'email'],
    filterableColumns: {
        type: [FilterOperator.EQ],
        email: [FilterOperator.CONTAINS],
    },
    defaultLimit: AppConfig.PAGINATION_DEFAULT_LIMIT,
    maxLimit: AppConfig.PAGINATION_MAX_LIMIT,   
};
