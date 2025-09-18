import { UserType } from "../enums/user-type.enum";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEYS = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEYS, roles);