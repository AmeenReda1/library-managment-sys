    import { Column, Entity, Index, OneToMany } from "typeorm";
import { AbstractEntity } from "src/common/abstract/abstract.entity";
import { BorrowingProcess } from "src/borrowing-process/entities/borrowing-process.entity";

@Entity('books')
export class Book extends AbstractEntity {

    @Column({type: 'varchar', length: 255})
    title: string;

    @Column({type: 'varchar', length: 255})
    author: string;

    @Column({nullable: true})
    description: string;

    @Column({unique: true})
    @Index({ unique: true })
    ISBN: number;

    @Column({type: 'varchar', length: 50})
    shelf_location: string;

    @Column({type: 'int', default: 1})
    available_quantity: number;

    @OneToMany(() => BorrowingProcess, borrowing => borrowing.book)
    borrowings: BorrowingProcess[];


}
