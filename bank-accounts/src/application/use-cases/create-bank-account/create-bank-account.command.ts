import { EBankAccountType } from "@domain/aggregates/bank-accounts/bank-account-type.enum";
import { EHolderType } from "@domain/aggregates/bank-accounts/holder-type.enum";

export abstract class CreateBankaAccountCommand {
    public abstract holderName: string;
    public abstract holderEmail: string;
    public abstract holderDocument: string;
    public abstract holderType: EHolderType;
    public abstract branch: string;
    public abstract bankAccountType: EBankAccountType;
}