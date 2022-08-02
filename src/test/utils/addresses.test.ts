import {describe, expect, test} from 'vitest'
import {init, UniqueUtils} from '../../index'

describe('addresses', async () => {
  await init()

  const opal = '5D7WxWqqUYNm962RUNdf1UTCcuasXCigHFMGG4hWX6hkp7zU'
  const quartz = 'yGDnKaHASMGaWSKS4Tv3SNQpTyJH89Ao3LfhgzcMbdhz6y2VT'
  const unique = 'unfZsSFU21ZtJwkEztT1Tc7c6T9R9GxseJgeUDwFQLSs8UDLb'
  const ethMirror = '0x2E61479A581F023808AAa5f2EC90bE6c2b250102'
  const doubleMirror = '5HikVEnsQT3U9LyTh5X9Bewud1wv4WkS7ovxrHRMCT2DFZPY'

  const ethAddress = '0x1B7AAcb25894D792601BBE4Ed34E07Ed14Fd31eB'
  const subMirrorOfEthAddress = '5EctGy9Wyoa8XT8fV8hrJHL6ywaSb2ui29vs47Ybe8jfMYHR'

  test.concurrent('is', () => {
    expect(UniqueUtils.Address.is.substrateAddress(opal)).toBe(true)
    expect(UniqueUtils.Address.is.substrateAddress(ethAddress)).toBe(false)
    expect(UniqueUtils.Address.is.substrateAddress('123')).toBe(false)

    expect(UniqueUtils.Address.is.ethereumAddress(opal)).toBe(false)
    expect(UniqueUtils.Address.is.ethereumAddress(ethAddress)).toBe(true)
    expect(UniqueUtils.Address.is.ethereumAddress('123')).toBe(false)
  })

  test.concurrent('mirror.substrateToEthereum', () => {
    expect(UniqueUtils.Address.mirror.substrateToEthereum(opal)).toBe(ethMirror)
    expect(() => {
      UniqueUtils.Address.mirror.substrateToEthereum('123')
    }).toThrowError()
  })

  test.concurrent('mirror.ethereumToSubstrate', () => {
    expect(UniqueUtils.Address.mirror.ethereumToSubstrate(ethMirror)).toBe(doubleMirror)
    expect(UniqueUtils.Address.mirror.ethereumToSubstrate(ethAddress)).toBe(subMirrorOfEthAddress)
    expect(() => {
      UniqueUtils.Address.mirror.ethereumToSubstrate('123')
    }).toThrowError()
  })

  test.concurrent('normalize.substrateAddress', () => {
    expect(UniqueUtils.Address.normalize.substrateAddress(quartz)).toBe(opal)
    expect(UniqueUtils.Address.normalize.substrateAddress(quartz, 7391)).toBe(unique)
    expect(() => {
      UniqueUtils.Address.normalize.substrateAddress('123')
    }).toThrowError()
  })

  test.concurrent('normalize.ethereumAddress', () => {
    expect(UniqueUtils.Address.normalize.ethereumAddress(ethMirror.toLowerCase())).toBe(ethMirror)
    expect(() => {
      UniqueUtils.Address.normalize.ethereumAddress('123')
    }).toThrowError()
  })

  test.concurrent('Collection address ', () => {
    expect(UniqueUtils.Address.collection.idToAddress(127))
      .toBe('0x17c4e6453cC49aAAAeACa894E6d9683E0000007f')

    expect(() => {
      UniqueUtils.Address.collection.idToAddress(2 ** 32)
    }).toThrow()

    expect(UniqueUtils.Address.collection.addressToId('0x17c4E6453CC49AAAAEAca894E6D9683e000000fF'))
      .toBe(255)

    expect(() => {
      UniqueUtils.Address.collection.addressToId('0x17c4E6453CC49AAAAEAca894E6D9683e000000f')
    }).toThrow()
  })

  test.concurrent('Nesting address', () => {
    expect(UniqueUtils.Address.nesting.addressToIds('0xF8238cCfFf8Ed887463Fd5E00000000000000000'))
      .toEqual({collectionId: 0, tokenId: 0})

    expect(UniqueUtils.Address.nesting.addressToIds('0xF8238CCFfF8ed887463fd5E0000000fE0000007F'))
      .toEqual({collectionId: 254, tokenId: 127})

    expect(UniqueUtils.Address.nesting.addressToIds('0xF8238CcFFF8ed887463fD5E0fffffFFFFFfFFffF'))
      .toEqual({collectionId: 2 ** 32 - 1, tokenId: 2 ** 32 - 1})

    expect(() => {UniqueUtils.Address.nesting.addressToIds('0xF8238CCFfF8ed887463fd5E0000000fE0000007')})
      .toThrow()

    expect(UniqueUtils.Address.nesting.idsToAddress(0, 0))
      .toBe('0xF8238cCfFf8Ed887463Fd5E00000000000000000')

    expect(UniqueUtils.Address.nesting.idsToAddress(254, 127))
      .toBe('0xF8238CCFfF8ed887463fd5E0000000fE0000007F')

    expect(UniqueUtils.Address.nesting.idsToAddress(2 ** 32 - 1, 2 ** 32 - 1))
      .toBe('0xF8238CcFFF8ed887463fD5E0fffffFFFFFfFFffF')

    expect(() => {
      UniqueUtils.Address.nesting.idsToAddress(-1, 0)
    }).toThrow()
    expect(() => {
      UniqueUtils.Address.nesting.idsToAddress(2 ** 32, 0)
    }).toThrow()
    expect(() => {
      UniqueUtils.Address.nesting.idsToAddress(0, -1)
    }).toThrow()
    expect(() => {
      UniqueUtils.Address.nesting.idsToAddress(0, 2 ** 32)
    }).toThrow()
    expect(() => {
      UniqueUtils.Address.nesting.idsToAddress(-1, -1)
    }).toThrow()
    expect(() => {
      UniqueUtils.Address.nesting.idsToAddress(2 ** 32, 2 ** 32)
    }).toThrow()
  })
})
