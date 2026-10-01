declare module "bcryptjs" {
  const bcrypt: any;
  export default bcrypt;
  export function hash(s: string, salt: number | string): Promise<string>;
  export function compare(s: string, hash: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
  export function hashSync(s: string, salt?: number | string): string;
  export function compareSync(s: string, hash: string): boolean;
}

declare module "jsonwebtoken" {
  const jwt: any;
  export default jwt;
  export function sign(payload: string | Buffer | object, secretOrPrivateKey: any, options?: any): string;
  export function verify(token: string, secretOrPublicKey: any, options?: any): any;
  export function decode(token: string, options?: any): any;
}
