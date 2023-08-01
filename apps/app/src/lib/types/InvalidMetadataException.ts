/**
 * An exception used when attempting to parse metadata
 */
class InvalidMetadataException extends Error {
  constructor(message: string) {
    super(`Invalid metadata: ${message}`)
    this.name = 'InvalidMetadataException'
  }
}

export { InvalidMetadataException }
