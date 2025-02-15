import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { BankAccount } from "../bank-accounts/bank-account.entity";
import { z } from "zod";
import { DomainException } from "@domain/common/domain-exception";
import { HttpStatus } from "@nestjs/common";

@Entity({ name: 'Balances', schema: 'BankAccounts' })
export class Balance {
    @PrimaryColumn({ type: 'int' })
    public bankAccountId: number;

    @OneToOne(() => BankAccount)
    @JoinColumn({ name: 'bankAccountId' })
    public bankAccount: BankAccount;

    @Column({ type: 'decimal', precision: 18, scale: 2 })
    public availableAmount: number;

    @Column({ type: 'decimal', precision: 18, scale: 2 })
    public blockedAmount: number;

    public create(bankAccount: BankAccount): this {
        this.bankAccount = bankAccount;
        this.availableAmount = 0;
        this.blockedAmount = 0;
        return this;
    }

    private static validate(balance: Balance) {
        const balanceSchema = z.object({
            availableAmount: z.number().min(0, { message: 'O valor disponível não pode ser negativo.' }),
            blockedAmount: z.number().min(0, { message: 'O valor bloqueado não pode ser negativo.' }),
        });

        const result = balanceSchema.safeParse(balance);
        if (!result.success) {
            throw new DomainException(result.error?.errors[0]?.message, HttpStatus.BAD_REQUEST);
        }
    }

    public block(amount: number) {
        this.availableAmount -= amount;
        this.blockedAmount += amount;
        Balance.validate(this);
    }

    public unlock(amount: number) {
        this.availableAmount += amount;
        this.blockedAmount -= amount;
        Balance.validate(this);
    }

    public increase(amount: number) {
        this.availableAmount += amount;
        Balance.validate(this);
    }

    public decrease(amount: number) {
        this.availableAmount -= amount;
        Balance.validate(this);
    }
}