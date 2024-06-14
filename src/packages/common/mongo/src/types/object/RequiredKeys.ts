export type RequiredKeys<T extends object> = RequiredKey<T, keyof T & string>;
type RequiredKey<T extends object, K extends keyof T & string> = K extends keyof T ? undefined extends T[K] ? never : K : never;
