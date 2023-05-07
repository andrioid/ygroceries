// Inject node globals into React Native global scope.
// Required for crypto functionality for bitcoinjs-lib, web3, etc.

global.Buffer = global.Buffer || require("buffer").Buffer;
//global.crypto = global.crypto || require("expo-crypto").crypto;
