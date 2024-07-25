/* eslint-disable no-unused-vars */
import { ICity, ICountry, IState } from 'country-state-city'

/**
 * Version numbers for opportunity metadata
 */
export enum OpportunityMetadataVersion {
  '1.0.0' = '1.0.0',
  '1.0.1' = '1.0.1',
  '1.0.2' = '1.0.2'
}

/**
 * Version numbers for cause metadata
 */
export enum CauseMetadataVersion {
  '1.0.0' = '1.0.0',
  '1.0.1' = '1.0.1'
}

/**
 * Version numbers for log VHR request metadata
 */
export enum LogVhrRequestMetadataVersions {
  '1.0.0' = '1.0.0'
}

/**
 * Version numbers for goal metadata
 */
export enum GoalMetadataVersion {
  '1.0.0' = '1.0.0'
}

/**
 * Version numbers for volunteer opportunity application metadata
 */
export enum ApplicationMetadataVersion {
  '1.0.0' = '1.0.0'
}

/**
 * Version numbers for lens profile metadata
 */
export enum ProfileMetadataVersions {
  '1.0.0' = '1.0.0'
}

/**
 * Object containing enums for different metadata version posts
 */
export const MetadataVersion = {
  OpportunityMetadataVersion,
  CauseMetadataVersion,
  GoalMetadataVersion,
  ProfileMetadataVersions,
  LogVhrRequestMetadataVersions,
  ApplicationMetadataVersion
}

/**
 * Different display types for metadata attributes
 */
export enum MetadataDisplayType {
  number = 'number',
  string = 'string',
  date = 'date',
  STRING = 'STRING'
}

/**
 * Interface that describes the shape of a metadata attribute
 */
export interface AttributeData {
  displayType?: MetadataDisplayType
  traitType?: string
  value: string
  key: string
}

/**
 * Metadata standard for Lens profile metadata
 *
 * Used to update the profile metadata, as shown in the {@link https://docs.lens.xyz/docs/create-set-update-profile-metadata-typed-data | Lens documentation}
 */
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

/**
 * Interface for required fields in a form location input
 */
export interface IFormLocation {
  country: string
  province: string
  city: string
}
