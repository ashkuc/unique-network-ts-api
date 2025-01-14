import {COLLECTION_ADDRESS_PREFIX, NESTING_PREFIX} from './constants'

import {
  addressToEvm, compareSubstrateAddresses,
  decodeSubstrateAddress, encodeSubstrateAddress,
  evmToAddress,
  normalizeSubstrateAddress
} from './substrate'

import {
  collectionIdAndTokenIdToNestingAddress,
  collectionIdToEthAddress, compareEthereumAddresses,
  ethAddressToCollectionId,
  nestingAddressToCollectionIdAndTokenId,
  normalizeEthereumAddress
} from './ethereum'
import {
  CrossAccountId, CrossAccountIdUncapitalized,
  EthAddressObj, EthAddressObjUncapitalized,
  SubAddressObj, SubAddressObjUncapitalized,
} from "../../types";
import {
  substrateNormalizedWithMirrorIfEthereum,
  addressToCrossAccountId, addressToCrossAccountIdNormalized,
  guessAddressAndExtractItNormalized,
  guessAddressAndExtractItNormalizedSafe
} from "./crossAccountId";

export * as StringUtils from './stringUtils'
export * as algorithms from './imports'
import * as constants from './constants'

export {constants}

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

export type DecodeSubstrateAddressResult = {
  u8a: Uint8Array,
  hex: string,
  bigint: bigint
}

export const validate = {
  substrateAddress: (address: string) => {
    decodeSubstrateAddress(address)
    return true
  },
  ethereumAddress: (address: string) => {
    if (!is.ethereumAddress(address)) {
      throw new Error(`address "${address}" is not valid ethereum address`)
    }
    return true
  },
  collectionAddress: (address: string) => {
    if (!is.collectionAddress(address)) {
      throw new Error(`address ${address} is not a collection address`)
    }
    return true
  },
  nestingAddress: (address: string) => {
    if (!is.nestingAddress(address)) {
      throw new Error(`address ${address} is not a nesting address`)
    }
    return true
  },
  collectionId: (collectionId: number) => {
    if (!is.collectionId(collectionId)) {
      throw new Error(`collectionId should be a number between 0 and 0xffffffff`)
    }
    return true
  },
  tokenId: (tokenId: number) => {
    if (!is.tokenId(tokenId)) {
      throw new Error(`collectionId should be a number between 0 and 0xffffffff`)
    }
    return true
  },
}

export const is = {
  substrateAddress: (address: string): boolean => {
    try {
      decodeSubstrateAddress(address)
      return true
    } catch {
      return false
    }
  },
  ethereumAddress: (address: string): boolean => {
    return typeof address === 'string' && address.length === 42 && !!address.match(ETH_ADDRESS_REGEX)
  },

  collectionAddress: (address: string): boolean => {
    return is.ethereumAddress(address) && address.toLowerCase().startsWith(COLLECTION_ADDRESS_PREFIX)
  },
  nestingAddress: (address: string): boolean => {
    return is.ethereumAddress(address) && address.toLowerCase().startsWith(NESTING_PREFIX)
  },

  collectionId: (collectionId: number): boolean => {
    return !(typeof collectionId !== 'number' || collectionId < 0 || collectionId > 0xffffffff)
  },
  tokenId: (tokenId: number): boolean => {
    return !(typeof tokenId !== 'number' || tokenId < 0 || tokenId > 0xffffffff)
  },

  crossAccountId(obj: any): obj is CrossAccountId {
    return is.substrateAddressObject(obj) || is.ethereumAddressObject(obj)
  },
  crossAccountIdUncapitalized(obj: any): obj is CrossAccountIdUncapitalized {
    return is.substrateAddressObjectUncapitalized(obj) || is.ethereumAddressObjectUncapitalized(obj)
  },
  substrateAddressObject(obj: any): obj is SubAddressObj {
    return typeof obj === 'object' && typeof obj?.Substrate === 'string' && is.substrateAddress(obj.Substrate)
  },
  ethereumAddressObject(obj: any): obj is EthAddressObj {
    return typeof obj === 'object' && typeof obj?.Ethereum === 'string' && is.ethereumAddress(obj.Ethereum)
  },
  substrateAddressObjectUncapitalized(obj: any): obj is SubAddressObjUncapitalized {
    return typeof obj === 'object' && typeof obj?.substrate === 'string' && is.substrateAddress(obj.substrate)
  },
  ethereumAddressObjectUncapitalized(obj: any): obj is EthAddressObjUncapitalized {
    return typeof obj === 'object' && typeof obj?.ethereum === 'string' && is.ethereumAddress(obj.ethereum)
  },
}

export const collection  = {
  idToAddress: collectionIdToEthAddress,
  addressToId: ethAddressToCollectionId,
}
export const nesting = {
  idsToAddress: collectionIdAndTokenIdToNestingAddress,
  addressToIds: nestingAddressToCollectionIdAndTokenId,
}
export const to = {
  crossAccountId: addressToCrossAccountId,
  crossAccountIdNormalized: addressToCrossAccountIdNormalized,
  substrateNormalizedOrMirrorIfEthereum: substrateNormalizedWithMirrorIfEthereum,
}

export const extract = {
  normalizedAddressFromObject: guessAddressAndExtractItNormalized,
  normalizedAddressFromObjectSafe: guessAddressAndExtractItNormalizedSafe,
  crossAccountIdFromObject: (obj: any): CrossAccountId => {
    return addressToCrossAccountId(guessAddressAndExtractItNormalized(obj))
  },
  crossAccountIdFromObjectNormalized: (obj: any): CrossAccountId => {
    return addressToCrossAccountId(guessAddressAndExtractItNormalized(obj))
  },
}

export const mirror = {
  substrateToEthereum: addressToEvm,
  ethereumToSubstrate: evmToAddress,
}

export const normalize = {
  substrateAddress: normalizeSubstrateAddress,
  ethereumAddress: normalizeEthereumAddress,
}

export const compare = {
  substrateAddresses: compareSubstrateAddresses,
  ethereumAddresses: compareEthereumAddresses,
}

export const substrate = {
  encode: encodeSubstrateAddress,
  decode: decodeSubstrateAddress,
  compare: compareSubstrateAddresses,
}

export const Address = {
  constants,
  is,
  validate,
  collection,
  nesting,
  to,
  extract,
  mirror,
  normalize,
  compare,
}
