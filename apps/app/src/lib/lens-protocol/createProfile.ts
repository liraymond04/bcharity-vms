import lensClient from './lensClient'

/**
 *
 * @param handle The lens handle to create
 * @returns the RelayerResultFragment or RelayerErrorFragment returned when attempting to create the profile
 */
const createProfile = async (handle: string) => {
  const profileCreateResult = await lensClient().profile.create({
    handle
    // other request args
  })

  // profileCreateResult is a Result object
  const profileCreateResultValue = profileCreateResult.unwrap()

  return profileCreateResultValue
}

export default createProfile
