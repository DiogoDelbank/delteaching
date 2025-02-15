import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { BankAccount } from "../bank-accounts/bank-account.entity";
import { z } from "zod";

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

    public create(bankAccount: BankAccount) {
        this.bankAccount = bankAccount;
        this.availableAmount = 0;
        this.blockedAmount = 0;
    }

    private static validate(balance: Balance) {
        const balanceSchema = z.object({
            availableAmount: z.number().min(0, 'O valor disponível não pode ser negativo.'),
            blockedAmount: z.number().min(0, 'O valor bloqueado não pode ser negativo.'),
        });

        const result = balanceSchema.safeParse(balance);
        if (!result.success) {
            throw new Error(`Falha na validação: ${result.error.errors.map(e => e.message).join(', ')}`);
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