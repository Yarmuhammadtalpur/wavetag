import * as crypto from 'crypto-js';

export const convertToSha512 = (data: string): string => {
    const hashedData: string = crypto.SHA512(data).toString(crypto.enc.Hex);
    return hashedData;
  };
