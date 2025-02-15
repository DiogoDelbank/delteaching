export abstract class BankAccountHolder {
    public abstract name: string;
    public abstract email: string;
    public abstract document: string;
    public abstract type: string;
}

export abstract class BankAcocuntDto {
    public abstract number: string;
    public abstract branch: string;
    public abstract holder: BankAccountHolder;
    public abstract type: string;
    public abstract createdAt: Date;
    public abstract updatedAt: Date;
}