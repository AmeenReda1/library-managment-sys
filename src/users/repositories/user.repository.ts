import { AbstractRepository } from "src/common/abstract/abstract.repository.entity"
import { User } from "../entities/user.entity"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

export class UserRepository extends AbstractRepository<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super(userRepository, 'User not found');
    }
}