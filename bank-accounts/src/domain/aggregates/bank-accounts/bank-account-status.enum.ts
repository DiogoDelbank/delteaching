export enum EBankAccountStatus {
    ACTIVE = 1,
    BLOCKED,
    FINISHED
}

export const BankAccountStatusLabel = {
    [EBankAccountStatus.ACTIVE]: 'ACTIVE',
    [EBankAccountStatus.BLOCKED]: 'BLOCKED',
    [EBankAccountStatus.FINISHED]: 'FINISHED'
} as const;