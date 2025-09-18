import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { AbstractEntity } from "src/common/abstract/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Book } from "src/books/entities/book.entity";

@Entity('borrowings')
export class BorrowingProcess extends AbstractEntity {

    @ManyToOne(() => User, user => user.borrowings, { eager: true })
    @JoinColumn({ name: 'borrower_id' })
    borrower: User;

    @ManyToOne(() => Book, book => book.borrowings, { eager: true })
    @JoinColumn({ name: 'book_id' })
    book: Book;

    @Column({ type: 'date' })
    borrowed_at: Date;

    @Column({ type: 'date' })
    due_date: Date;

    @Column({ type: 'date', nullable: true, default: null })
    returned_at: Date | null;

    @Column({ type: 'boolean', default: false })
    isReturned: boolean;
}
