export enum ETransactionType {
    CREDIT = 1,
    DEBIT,
    AMOUNT_HOLD,
    AMOUNT_RELEASE
}

export const TransactionTypeLabel = {
    [ETransactionType.CREDIT]: 'CREDIT',
    [ETransactionType.DEBIT]: 'DEBIT',
    [ETransactionType.AMOUNT_HOLD]: 'AMOUNT_HOLD',
    [ETransactionType.AMOUNT_RELEASE]: 'AMOUNT_RELEASE'
}