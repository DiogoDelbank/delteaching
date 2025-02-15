export enum EHolderType {
    NATURAL = 1,
    LEGAL
}

export const HolderTypeLabel = {
    [EHolderType.NATURAL]: 'NATURAL',
    [EHolderType.LEGAL]: 'LEGAL'
} as const;