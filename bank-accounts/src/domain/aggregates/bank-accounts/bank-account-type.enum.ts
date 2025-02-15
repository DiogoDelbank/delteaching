export enum EBankAccountType {
    PAYMENT = 1,
    CURRENT
}

export const BankAccountTypeLabel = {
    [EBankAccountType.PAYMENT]: 'PAYMENT',
    [EBankAccountType.CURRENT]: 'CURRENT'
} as const;