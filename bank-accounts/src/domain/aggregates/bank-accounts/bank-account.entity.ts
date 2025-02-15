import { AfterLoad, BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EBankAccountType } from "./bank-account-type.enum";
import { EHolderType } from "./holder-type.enum";
import { EBankAccountStatus } from "./bank-account-status.enum";
import { Balance } from "../balances/balance.entity";
import { z } from "zod";
import { Transaction } from "../transactions/transaction.entity";
import { DomainException } from "@domain/common/domain-exception";
import { HttpStatus } from "@nestjs/common";

export type BankAccountProps = {
    branch: string;
    type: EBankAccountType;
    holderName: string;
    holderEmail: string;
    holderDocument: string;
    holderType: EHolderType;
    bankAccountNumber: string;
}

@Entity({ name: 'BankAccounts', schema: 'BankAccounts' })
export class BankAccount {

    private static readonly holderNameMaxLength = 200;
    private static readonly holderEmailMaxLength = 200;
    private static readonly bankAccountNumberMaxLength = 10;
    private static readonly bankAccountNumberMinLength = 5;
    private static readonly holderDocumentMaxLength = 14;
    private static readonly holderDocumentMinLength = 11;
    private static readonly branchMaxLength = 5;

    @PrimaryGeneratedColumn({ type: 'int' })
    public id: number;

    @OneToOne(() => Balance, (balance) => balance.bankAccount, { cascade: true })
    public balance: Balance;

    @OneToMany(() => Transaction, (transaction) => transaction.bankAccount, { cascade: true })
    public transactions: Transaction[];

    @Column({ nullable: false, length: BankAccount.branchMaxLength })
    public branch: string;

    @Column({ unique: true, length: BankAccount.bankAccountNumberMaxLength })
    public number: string;

    @Column({ nullable: false })
    public type: EBankAccountType;

    @Column({ nullable: false, length: BankAccount.holderNameMaxLength })
    public holderName: string;

    @Column({ nullable: false, length: BankAccount.holderEmailMaxLength })
    public holderEmail: string;

    @Column({ nullable: false, length: BankAccount.holderDocumentMaxLength })
    public holderDocument: string;

    @Column({ nullable: false })
    public holderType: EHolderType;

    @Column({ nullable: false, default: EBankAccountStatus.ACTIVE })
    public status: EBankAccountStatus;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    public create(props: BankAccountProps): this {
        this.number = props.bankAccountNumber;
        this.holderName = props.holderName;
        this.holderEmail = props.holderEmail;
        this.holderDocument = props.holderDocument;
        this.holderType = props.holderType;
        this.type = props.type;
        this.branch = props.branch;
        BankAccount.validate(this);
        return this;
    }

    @BeforeInsert()
    private generateBankAccountNumber() {
        if (this.id) {
            this.number = (10000 + this.id).toString();
        }
    }

    @AfterLoad()
    private afterLoad() {
        if (!this.number && this.id) {
            this.number = (10000 + this.id).toString();
        }
    }

    private static validate(bankAccount: BankAccount) {
        const bankAccountSchema = z.object({
            branch: z.string().min(1, { message: 'O campo "agência" não pode estar vazio.' })
                .max(BankAccount.branchMaxLength, { message: `O campo "agência" deve ter no máximo ${BankAccount.branchMaxLength} caracteres.` }),
            number: z.string().min(BankAccount.bankAccountNumberMinLength, { message: `O número da conta bancária deve ter no mínimo ${BankAccount.bankAccountNumberMinLength} caracteres.` })
                .max(BankAccount.bankAccountNumberMaxLength, { message: `O número da conta bancária deve ter no máximo ${BankAccount.bankAccountNumberMaxLength} caracteres.` }),
            holderName: z.string().min(1, { message: 'O campo "nome do titular" não pode estar vazio.' })
                .max(BankAccount.holderNameMaxLength, { message: `O nome do titular deve ter no máximo ${BankAccount.holderNameMaxLength} caracteres.` }),
            holderEmail: z.string().email('Formato de e-mail inválido.')
                .max(BankAccount.holderEmailMaxLength, `O campo "e-mail" deve ter no máximo ${BankAccount.holderEmailMaxLength} caracteres.`),
            holderDocument: z.string()
                .min(BankAccount.holderDocumentMinLength, `O documento do titular deve ter no mínimo ${BankAccount.holderDocumentMinLength} caracteres.`)
                .min(BankAccount.holderDocumentMaxLength, `O documento do titular deve ter no máximo ${BankAccount.holderDocumentMaxLength} caracteres.`)
        });

        const result = bankAccountSchema.safeParse(bankAccount);
        if (!result.success) {
            throw new DomainException(result.error?.errors[0]?.message, HttpStatus.BAD_REQUEST);
        }
    }

    public updateEmail(email: string): this {
        this.holderEmail = email;
        BankAccount.validate(this);
        return this;
    }

    public updateStatus(status: EBankAccountStatus): this {
        this.status = status;
        BankAccount.validate(this)
        return this;
    }
}