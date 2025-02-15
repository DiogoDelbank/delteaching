import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BankAccount } from "../bank-accounts/bank-account.entity";
import { EBankAccountType } from "../bank-accounts/bank-account-type.enum";
import { ETransactionType } from "./transaction-type.enum";
import { EHolderType } from "../bank-accounts/holder-type.enum";
import { z } from 'zod';
import { HttpStatus } from "@nestjs/common";
import { DomainException } from "@domain/common/domain-exception";

export type TransactionProps = {
    type: ETransactionType;
    amount: number;
    bankAccount: BankAccount;
    counterpartyBankCode: string;
    counterpartyBankName: string;
    counterpartyBranch: string;
    counterpartyHolderName: string;
    counterpartyAccountNumber: string;
    counterpartyAccountType: EBankAccountType;
    counterpartyHolderType: EHolderType;
    counterpartyHolderDocument: string;
}

@Entity({ name: 'Transactions', schema: 'BankAccounts' })
export class Transaction {

    private static readonly bankCodeMaxLength = 3;
    private static readonly holderNameMaxLength = 200;
    private static readonly bankNameMaxLength = 200;
    private static readonly bankAccountNumberMaxLength = 10;
    private static readonly holderDocumentMaxLength = 14;
    private static readonly branchMaxLength = 5;

    @PrimaryGeneratedColumn({ type: 'int' })
    public id: number;

    @Column({ nullable: false })
    public type: ETransactionType;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: false })
    public amount: number;

    @ManyToOne(() => BankAccount, (bankAccount) => bankAccount.transactions)
    public bankAccount: BankAccount;

    @Column({ nullable: false, length: Transaction.bankCodeMaxLength })
    public counterpartyBankCode: string;

    @Column({ nullable: false, length: Transaction.bankNameMaxLength })
    public counterpartyBankName: string;

    @Column({ nullable: false, length: Transaction.branchMaxLength })
    public counterpartyBranch: string;

    @Column({ nullable: false, length: Transaction.bankAccountNumberMaxLength })
    public counterpartyAccountNumber: string;

    @Column({ nullable: false })
    public counterpartyAccountType: EBankAccountType;

    @Column({ nullable: false, length: Transaction.holderNameMaxLength })
    public counterpartyHolderName: string;

    @Column({ nullable: false })
    public counterpartyHolderType: EHolderType;

    @Column({ nullable: false, length: Transaction.holderDocumentMaxLength })
    public counterpartyHolderDocument: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    public create(transaction: TransactionProps): this {
        this.amount = transaction.amount;
        this.bankAccount = transaction.bankAccount;
        this.counterpartyBankCode = transaction.counterpartyBankCode;
        this.counterpartyAccountNumber = transaction.counterpartyAccountNumber;
        this.counterpartyAccountType = transaction.counterpartyAccountType;
        this.counterpartyBankName = transaction.counterpartyBankName;
        this.counterpartyBranch = transaction.counterpartyBranch;
        this.counterpartyHolderDocument = transaction.counterpartyHolderDocument;
        this.counterpartyHolderName = transaction.counterpartyHolderName;
        this.counterpartyHolderType = transaction.counterpartyHolderType;
        Transaction.validate(this);
        return this;
    }

    private static validate(transaction: Transaction) {
        const schema = z.object({
            amount: z.number().gt(0, { message: 'O valor da transação deve ser maior que 0.' }),
            counterpartyBankCode: z.string().length(Transaction.bankCodeMaxLength, {
                message: `O código do banco da contraparte deve ter ${Transaction.bankCodeMaxLength} caracteres.`,
            }),
            counterpartyBankName: z.string().max(Transaction.bankNameMaxLength, {
                message: `O nome do banco da contraparte não pode exceder ${Transaction.bankNameMaxLength} caracteres.`,
            }),
            counterpartyBranch: z.string().length(Transaction.branchMaxLength, {
                message: `O código da agência da contraparte deve ter ${Transaction.branchMaxLength} caracteres.`,
            }),
            counterpartyAccountNumber: z.string().max(Transaction.bankAccountNumberMaxLength, {
                message: `O número da conta da contraparte não pode exceder ${Transaction.bankAccountNumberMaxLength} caracteres.`,
            }),
            counterpartyHolderDocument: z.string().length(Transaction.holderDocumentMaxLength, {
                message: `O documento do titular da contraparte deve ter ${Transaction.holderDocumentMaxLength} caracteres.`,
            }).regex(/^\d{11}$|^\d{14}$/, {
                message: 'O documento do titular da contraparte deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.',
            })
        });

        try {
            schema.parse(transaction);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new DomainException(error?.errors[0]?.message, HttpStatus.BAD_REQUEST);
            }
            throw error;
        }
    }
}