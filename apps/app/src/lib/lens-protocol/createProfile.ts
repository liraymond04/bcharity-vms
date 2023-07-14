import lensClient from './lensClient'

export const isValidHandle = (handle: string) => {
  const pattern = /^[a-z0-9.]*$/
  if (!pattern.test(handle)) {
    return false
  }
  return true
}

const createProfile = async (handle: string) => {
  const profileCreateResult = await lensClient.profile.create({
    handle
    // other request args
  })

  // profileCreateResult is a Result object
  const profileCreateResultValue = profileCreateResult.unwrap()

  return profileCreateResultValue
}

export default createProfile
