const pattern = /^[a-z0-9.]*$/

export const isValidHandle = (handle: string) => {
  return pattern.test(handle)
}

export default isValidHandle
