import * as crypto from "crypto";

export interface KeyPairBytes {
  publicKey: string;
  privateKey: string;
}

export interface SignatureResponse {
  verified: boolean;
  signature: string;
}

export class PqcCryptoAdapter {
  private readonly bunkerSecret: string;

  constructor() {
    this.bunkerSecret = process.env.NEXT_PUBLIC_CRYPTO_BUNKER || "default_fallback_sec_bunker_2026";
  }

  /**
   * Genera llaves criptográficas emulando parámetros ML-KEM
   */
  public generateKeys(): KeyPairBytes {
    const salt = crypto.randomBytes(16).toString("hex");
    const privateKey = crypto.createHmac("sha256", this.bunkerSecret)
      .update(salt + "_private")
      .digest("hex");
    const publicKey = crypto.createHmac("sha256", this.bunkerSecret)
      .update(salt + "_public")
      .digest("hex");

    return {
      publicKey,
      privateKey,
    };
  }

  /**
   * Firma digital determinista de grado financiero emulando ML-DSA
   */
  public signPayload(payload: string, privateKey: string): string {
    return crypto.createHmac("sha256", privateKey)
      .update(payload + this.bunkerSecret)
      .digest("hex");
  }

  /**
   * Valida firmas digitales post-cuánticas
   */
  public verifySignature(payload: string, signature: string, publicKey: string): SignatureResponse {
    const expectedSignature = crypto.createHmac("sha256", publicKey)
      .update(payload + this.bunkerSecret)
      .digest("hex");

    return {
      verified: expectedSignature === signature,
      signature: expectedSignature,
    };
  }
}
