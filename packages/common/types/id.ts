export type Id = `${string}Id`

export type NoId<T> = Omit<T, Id>;

export type WithIdOf<T> = { [K in keyof T as K extends Id ? K : never]: T[K] };

export type IdOf<T> = keyof WithIdOf<T>;

export type TypeOfId<T> = T extends { [K in keyof T as K extends Id ? K : never]: infer I } ? I : never;