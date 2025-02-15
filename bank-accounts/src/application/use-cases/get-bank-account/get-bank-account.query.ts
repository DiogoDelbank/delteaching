export abstract class GetBankAccountQuery {
    public abstract bankAccountNumber: string;
    public abstract branch: string;
    public abstract holderDocument: string;
}