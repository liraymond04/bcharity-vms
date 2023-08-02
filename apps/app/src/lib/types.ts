/* eslint-disable no-unused-vars */
import { ProfileFragment } from '@lens-protocol/client'
import { MetadataAttributeInput } from '@lens-protocol/client'
import { ICity, ICountry, IState } from 'country-state-city'

export enum OpportunityMetadataVersion {
  '1.0.0' = '1.0.0'
}

export enum CauseMetadataVersion {
  '1.0.0' = '1.0.0'
}

export enum LogVhrRequestMetadataVersions {
  '1.0.0' = '1.0.0'
}

export enum GoalMetadataVersion {
  '1.0.0' = '1.0.0'
}

export enum ProfileMetadataVersions {
  '1.0.0'
}

export const MetadataVersion = {
  OpportunityMetadataVersion,
  CauseMetadataVersion,
  GoalMetadataVersion,
  ProfileMetadataVersions,
  LogVhrRequestMetadataVersions
}

interface opm<T> {
  /**
   * ProfileFragment type data for the profile that created the post
   */
  from: ProfileFragment
  /**
   * The metadata schema version
   */
  version: T
}
export interface GoalMetadata extends opm<GoalMetadataVersion> {
  /**
   * a uuid associated with a volunteer opporunity
   */

  /**
   * the opportunity nam e
   */
  goal: string
  /**
   * opportunity start date in YYYY-MM-DD format
   */

  /**
   * opportunity end date in YYYY-MM-DD format
   */
  goalDate: string
}
export interface GoalMetadataAttributeInput extends MetadataAttributeInput {
  traitType: keyof GoalMetadata | 'type'
}

export enum MetadataDisplayType {
  number = 'number',
  string = 'string',
  date = 'date'
}

export interface AttributeData {
  displayType?: MetadataDisplayType
  traitType?: string
  value: string
  key: string
}

export interface ProfileMetadata {
  /**
   * The metadata version.
   */
  version: ProfileMetadataVersions

  /**
   * The metadata id can be anything but if your uploading to ipfs
   * you will want it to be random.. using uuid could be an option!
   */
  metadata_id: string

  /**
   * The display name for the profile
   */
  name: string | null

  /**
   * The bio for the profile
   */
  bio: string | null

  /**
   * Cover picture
   */
  cover_picture: string | null

  /**
   * Any custom attributes can be added here to save state for a profile
   */
  attributes: AttributeData[]
}

/**
 * Interface to hold location data, split into country, province, and city, all
 * portentially undefined
 */
export interface ILocationData {
  /**
   * The country of the user, possibly undefined
   */
  country: ICountry | undefined
  /**
   * The provincial subdivision of the user, possibly undefined
   */
  province: IState | undefined
  /**
   * The city of the user, possibly undefined
   */
  city: ICity | undefined
}

export interface IFormLocation {
  country: string
  province: string
  city: string
}
