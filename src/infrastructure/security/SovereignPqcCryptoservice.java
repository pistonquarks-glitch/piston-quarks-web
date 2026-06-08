package src.infrastructure.security;

import org.bouncycastle.pqc.crypto.crystals.mldsa.MLDSAParameters;
import org.bouncycastle.pqc.crypto.crystals.mldsa.MLDSAKeyPairGenerator;
import org.bouncycastle.pqc.crypto.crystals.mldsa.MLDSAKeyGenerationParameters;
import java.security.SecureRandom;

/**
 * Sovereign PQC Cryptoservice
 * Implementa firma digital post-cuántica ML-DSA basada en cristales (NIST FIPS 204)
 * para transacciones financieras Zero-Trust.
 */
public class SovereignPqcCryptoservice {
    
    private final SecureRandom secureRandom;

    public SovereignPqcCryptoservice() {
        this.secureRandom = new SecureRandom();
    }

    /**
     * Genera un par de llaves post-cuánticas ML-DSA de grado financiero.
     */
    public MldsaKeyPair generateMldsaKeyPair() {
        try {
            MLDSAKeyPairGenerator generator = new MLDSAKeyPairGenerator();
            MLDSAKeyGenerationParameters params = new MLDSAKeyGenerationParameters(
                secureRandom, 
                MLDSAParameters.mldsa65 // Nivel de seguridad conforme a NIST
            );
            
            generator.init(params);
            var keyPair = generator.generateKeyPair();
            
            return new MldsaKeyPair(
                keyPair.getPublic().getEncoded(),
                keyPair.getPrivate().getEncoded()
            );
        } catch (Exception e) {
            throw new SecurityException("Fallo en la generación criptográfica PQC: " + e.getMessage(), e);
        }
    }

    public static class MldsaKeyPair {
        private final byte[] publicKey;
        private final byte[] privateKey;

        public MldsaKeyPair(byte[] publicKey, byte[] privateKey) {
            this.publicKey = publicKey;
            this.privateKey = privateKey;
        }

        public byte[] getPublicKey() {
            return publicKey;
        }

        public byte[] getPrivateKey() {
            return privateKey;
        }
    }
}
