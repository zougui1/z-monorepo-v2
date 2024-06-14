export type ArrayItem<T> = T extends Array<infer R> ? R : never;
