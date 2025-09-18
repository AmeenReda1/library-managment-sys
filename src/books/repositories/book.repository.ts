import { AbstractRepository } from "src/common/abstract/abstract.repository.entity"
import { Book } from "../entities/book.entity"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

export class BookRepository extends AbstractRepository<Book> {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {
        super(bookRepository, 'Book not found');
    }
}