import { Entity, Column, Index, OneToMany } from "typeorm";
import { AbstractEntity } from "src/common/abstract/abstract.entity";
import { UserType } from "src/common/enums";
import { BorrowingProcess } from "src/borrowing-process/entities/borrowing-process.entity";

@Entity()
export class User extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    @Index({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.BORROWER })
    type: UserType

    @OneToMany(() => BorrowingProcess, borrowing => borrowing.borrower)
    borrowings: BorrowingProcess[];

}
