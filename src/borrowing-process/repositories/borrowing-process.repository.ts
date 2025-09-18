import { AbstractRepository } from "src/common/abstract/abstract.repository.entity"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { BorrowingProcess } from "../entities/borrowing-process.entity";

export class BorrowingProcessRepository extends AbstractRepository<BorrowingProcess> {
    constructor(
        @InjectRepository(BorrowingProcess)
        private readonly borrowingProcessRepository: Repository<BorrowingProcess>,
    ) {
        super(borrowingProcessRepository, 'Book not found');
    }
}