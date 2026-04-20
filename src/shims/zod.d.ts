declare module 'zod' {
  export type ZodTypeAny = any;

  interface ZodBuilder {
    object(shape: Record<string, any>): any;
    string(): any;
    number(): any;
    boolean(): any;
    any(): any;
    record(value: any): any;
    array(value: any): any;
    union(values: any[]): any;
    literal(value: any): any;
    enum(values: readonly [string, ...string[]]): any;
  }

  export const z: ZodBuilder;
}
