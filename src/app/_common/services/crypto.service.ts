import * as crypto from 'crypto';
import { ConfigService } from 'nestjs-config';

import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  hash(text: string): string {
    const secret = this.configService.get('auth').cryptoSecret;

    return crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');
  }
}
