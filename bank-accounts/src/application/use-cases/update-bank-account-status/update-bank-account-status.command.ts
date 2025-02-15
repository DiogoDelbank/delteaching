import { EBankAccountStatus } from "@domain/aggregates/bank-accounts/bank-account-status.enum";

export abstract class UpdateBankAccountStatusCommand {
    public abstract bankAccountNumber: string;
    public abstract status: EBankAccountStatus;
}