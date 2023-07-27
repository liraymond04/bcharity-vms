import { Country, State } from 'country-state-city'

/**
 * @brief Helper function to format metadata location strings
 * @param locationString string in the format country-province-city
 *
 */
export const formatLocation = (locationString: string) => {
  const [country, province, city] = locationString.split('-', 3)

  const countryCode =
    Country.getAllCountries().find((c) => c.name === country)?.isoCode ?? ''
  const provinceCode = State.getStatesOfCountry(countryCode).find(
    (p) => p.name === province
  )?.isoCode

  return `${city}, ${provinceCode}`.toUpperCase()
}
