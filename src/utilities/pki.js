import forge from 'node-forge';
import { SecureStore } from 'expo';
import { getPerUserStoreKey, invalidateSharedPublicKey } from './store';

const PRIVATE_KEY_TAG = 'privateKey';
const PUBLIC_KEY_TAG = 'publicKey';
const KEYS_MARKER_TAG = 'keyPairMarker';

const makeKeys = () => {
  //let start = new Date();
  forge.pki.rsa.generateKeyPair({bits: 2048, workers: 1}, function(err, keypair) {
    //console.log('Elapsed keygen time for 2048 bits', (new Date()) - start);

    //console.log(forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey, 72));
    //console.log(forge.pki.privateKeyToPem(keypair.privateKey, 72));
    getPerUserStoreKey()
      .then((storeKey) => {
        SecureStore.setItemAsync(`${storeKey}.${PUBLIC_KEY_TAG}`, forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey, 72))
          .then( () => { 
            SecureStore.setItemAsync(`${storeKey}.${PRIVATE_KEY_TAG}`, forge.pki.privateKeyToPem(keypair.privateKey, 72))
              .then( () => { 
                  SecureStore.setItemAsync(`${storeKey}.${KEYS_MARKER_TAG}`, 'true');
              })
            })
          .catch((e) => { console.log( `Could not store keys in store (${e})` ) });
        });
      });
}

export const generateKeyPair = () => {
  let p = new Promise(function(resolve, reject) {
    keysExist().then((result) => {
        if (!result) {
          makeKeys();
        }
        resolve();
      }).catch((e) => reject(`Error getting marker from store (${e})`));
  });

  return p;
}

export const invalidateKeyPair = () => {
  let p = new Promise(async function(resolve, reject) {
    let storeKey = await getPerUserStoreKey();

    SecureStore.deleteItemAsync(`${storeKey}.${KEYS_MARKER_TAG}`)
      .then(() => {
        SecureStore.deleteItemAsync(`${storeKey}.${PRIVATE_KEY_TAG}`)
          .then(async () => {
              await invalidateSharedPublicKey();
              resolve();
            })
          .catch((e) => reject(`Error removing key from keystore (${e})`)); 
      })
      .catch((e) => reject(`Error removing key from keystore (${e})`)); 
  });

  return p;
}

export const keysExist = () => {
  let p = new Promise(async function(resolve, reject) {
    let storeKey = await getPerUserStoreKey();

    SecureStore.getItemAsync(`${storeKey}.${KEYS_MARKER_TAG}`)
      .then((marker) => {
        resolve(marker && (marker === 'true'));
      }).catch((e) => reject(`Error getting marker from store (${e})`));
  });

  return p;
}

export const encryptPKI = async (data, optionalPublicKey) => {
  if (optionalPublicKey) {
    return new Promise(function(resolve, reject) {
      try {
        const publicKey = forge.pki.publicKeyFromPem(optionalPublicKey);
        const encrypted = publicKey.encrypt(data);
        resolve(encrypted);
      } catch (e) {
        reject(`Error encrypting with optional public key (${e})`);
      }
    });
  }

  return new Promise(async function(resolve, reject) {
    let storeKey = await getPerUserStoreKey();

    SecureStore.getItemAsync(`${storeKey}.${PUBLIC_KEY_TAG}`)
      .then((publicKeyPEM) => {
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPEM);
        const encrypted = publicKey.encrypt(data);
        resolve(encrypted);
      }).catch((e) => reject(`Error getting public key from store (${e})`));
  });
}

export const decryptPKI = async (data) => {
  return new Promise(async function(resolve, reject) {
    let storeKey = await getPerUserStoreKey();

    SecureStore.getItemAsync(`${storeKey}.${PRIVATE_KEY_TAG}`)
      .then((privateKeyPEM) => {
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPEM);
        const decrypted = privateKey.decrypt(data);
        resolve(decrypted);
      }).catch((e) => reject(`Error getting private key from store (${e})`));
  });
}

export const publicKeyPEM = async () => {
  let p = new Promise(async function(resolve, reject) {
    let storeKey = await getPerUserStoreKey();

    SecureStore.getItemAsync(`${storeKey}.${PUBLIC_KEY_TAG}`)
      .then((publicKeyPEM) => {
        resolve(publicKeyPEM);
      }).catch((e) => reject(`Error getting public key from store (${e})`));
  });

  return p;
}

export const probeCPUPower = () => {
  return new Promise(function(resolve) {
    let start = new Date();
    forge.pki.rsa.generateKeyPair({bits: 512, workers: 1}, function(err, keypair) {
      resolve((new Date()) - start);
    });
  });
}