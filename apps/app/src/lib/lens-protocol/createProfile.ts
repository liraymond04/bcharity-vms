import lensClient from './lensClient'

/**
 *
 * @param handle The lens handle to create
 * @param address The lens address to create profile on
 * @returns the RelaySuccessFragment or CreateProfileWithHandleErrorResultFragment returned when attempting to create the profile
 */
const createProfile = async (handle: string, address: string) => {
  const profileCreateResult = await lensClient().wallet.createProfileWithHandle(
    {
      handle,
      to: address
    }
  )

  // profileCreateResult is a Result object
  const profileCreateResultValue = profileCreateResult

  return profileCreateResultValue
}

export default createProfile
