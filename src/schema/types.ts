import {CrossAccountId} from "../types";
import {getEnumValues} from "../tsUtils";
import {bool} from "@polkadot/types";

export type InfixOrUrlOrCid =
  { url: string, urlInfix?: undefined, ipfsCid?: undefined }
  |
  { urlInfix: string, url?: undefined, ipfsCid?: undefined }
  |
  { ipfsCid: string, url?: undefined, urlInfix?: undefined }
export type InfixOrUrlOrCidAndHash = InfixOrUrlOrCid & { hash?: string }
export const URL_TEMPLATE_INFIX = <const>'{infix}'
export type UrlTemplateString = `${string}${typeof URL_TEMPLATE_INFIX}${string}`


export enum AttributeType {
  integer = "integer",        // number
  float = "float",            // number
  boolean = "boolean",        // number
  timestamp = "timestamp",    // number // js, milliseconds from epoch
  string = "string",          // string
  url = "url",                // string
  isoDate = "isoDate",        // string // ISO Date: YYYY-MM-DD
  time = "time",              // string // 24h time: HH:mm:ss
  colorRgba = "colorRgba",    // string // 'rrggbbaa'
}

export const NumberAttributeTypes = [
  AttributeType.integer, AttributeType.float, AttributeType.boolean, AttributeType.timestamp,
]
export const IntegerAttributeTypes = [
  AttributeType.integer, AttributeType.boolean, AttributeType.timestamp,
]
export const StringAttributeTypes = [
  AttributeType.string, AttributeType.url, AttributeType.isoDate, AttributeType.time, AttributeType.colorRgba,
]
export const AttributeTypeValues = getEnumValues(AttributeType)


export type BoxedNumberWithDefault = {
  _: number
}
export type LocalizedStringWithDefault = {
  _: string
  [K: string]: string
}
export type LocalizedStringOrBoxedNumberWithDefault = BoxedNumberWithDefault | LocalizedStringWithDefault

export interface AttributeSchema {
  name: LocalizedStringWithDefault
  optional?: boolean
  isArray?: boolean
  type: AttributeType
  enumValues?: { [K: number]: LocalizedStringOrBoxedNumberWithDefault }
}

type EncodedEnumAttributeValue = number | Array<number>
export type EncodedTokenAttributeValue =
  number |
  Array<number> |
  LocalizedStringOrBoxedNumberWithDefault
  | LocalizedStringOrBoxedNumberWithDefault[]

export interface EncodedTokenAttributes {
  [K: number]: EncodedTokenAttributeValue
}

export type CollectionAttributesSchema = {
  [K: number]: AttributeSchema
}

export enum COLLECTION_SCHEMA_NAME {
  unique = 'unique',
  old = '_old_',
  ERC721Metadata = 'ERC721Metadata'
}

export interface UniqueCollectionSchemaToCreate {
  schemaName: COLLECTION_SCHEMA_NAME.unique
  schemaVersion: string // semver

  coverPicture: InfixOrUrlOrCidAndHash
  coverPicturePreview?: InfixOrUrlOrCidAndHash

  attributesSchemaVersion: string
  attributesSchema: CollectionAttributesSchema

  image: {
    urlTemplate: UrlTemplateString
  }

  imagePreview?: {
    urlTemplate?: UrlTemplateString
  }

  video?: {
    urlTemplate?: UrlTemplateString
  }

  audio?: {
    urlTemplate?: UrlTemplateString
    format: string
    isLossless?: boolean
  }

  spatialObject?: {
    urlTemplate?: UrlTemplateString
    format: string
  }
}

export type UniqueCollectionSchemaDecoded =
  Omit<UniqueCollectionSchemaToCreate, 'schemaName' | 'coverPicture' | 'coverPicturePreview'>
  & {
  schemaName: COLLECTION_SCHEMA_NAME
  collectionId: number
  coverPicture: DecodedInfixOrUrlOrCidAndHash
  coverPicturePreview?: DecodedInfixOrUrlOrCidAndHash
  oldProperties?: {
    _old_schemaVersion?: string
    _old_offchainSchema?: string
    _old_constOnChainSchema?: string
    _old_variableOnChainSchema?: string
  }
}

interface IToken<GenericInfixUrlOrCidWithHash> {
  name?: LocalizedStringWithDefault
  description?: LocalizedStringWithDefault
  image: GenericInfixUrlOrCidWithHash
  imagePreview?: GenericInfixUrlOrCidWithHash
  video?: GenericInfixUrlOrCidWithHash
  audio?: GenericInfixUrlOrCidWithHash
  spatialObject?: GenericInfixUrlOrCidWithHash
}

export interface UniqueTokenToCreate extends IToken<InfixOrUrlOrCidAndHash> {
  encodedAttributes?: EncodedTokenAttributes
}

export type DecodedAttributes = {
  [K: number]: {
    name: LocalizedStringWithDefault
    value: LocalizedStringOrBoxedNumberWithDefault | Array<LocalizedStringOrBoxedNumberWithDefault>
    type: AttributeType
    isArray: boolean
    rawValue: EncodedTokenAttributeValue
    isEnum: boolean
  }
}

export type DecodedInfixOrUrlOrCidAndHash = InfixOrUrlOrCidAndHash & { fullUrl: string | null }

export interface UniqueTokenDecoded extends IToken<DecodedInfixOrUrlOrCidAndHash> {
  tokenId: number
  collectionId: number
  owner: CrossAccountId
  nestingParentToken?: {
    collectionId: number
    tokenId: number
  }
  attributes: DecodedAttributes
}

export type DecodingImageLinkOptions = {
  imageUrlTemplate?: UrlTemplateString
  dummyImageFullUrl?: string
}
