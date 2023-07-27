import { City, Country, State } from 'country-state-city'
import { useState } from 'react'

import { ILocationData } from '../types'

/**
 * @brief hook to get the city, province, and country location of a user that does not run on render
 *
 * @description
 * Uses the browser geolocation interface and an external api and the
 * country-state-city library to get the city, province, and country that the
 * user is located at
 * external api docs: https://www.bigdatacloud.com/docs/api/free-reverse-geocode-to-city-api
 *
 * @returns
 * `data`: location data in the type `ILocationData` \
 * `loading`: whether or not the external api request and processing of location data is in progress \
 * `error`: an error message if the request failed or an empty string \
 * `denied`: whether or not the user denied the location data request in their browser
 * `execute`: the function to call to trigger the geolocation request
 */
const useLazyGeolocation = () => {
  const [locData, setLocData] = useState<ILocationData>({
    country: undefined,
    province: undefined,
    city: undefined
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [denied, setDenied] = useState(false)

  const execute = () => {
    setLoading(true)
    setError('')
    setDenied(false)

    navigator.geolocation.getCurrentPosition(
      (success) => {
        const latitude = success.coords.latitude.toString()
        const longitude = success.coords.longitude.toString()

        const params = new URLSearchParams({ latitude, longitude })

        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`
        )
          .then((res) => res.json())
          .then((data) => {
            const newData: ILocationData = {
              country: undefined,
              province: undefined,
              city: undefined
            }

            const _country = Country.getCountryByCode(data.countryCode)

            newData.country = _country

            const code = _country?.isoCode
            if (!code) return

            const province = State.getStatesOfCountry(code).find(
              (state) => state.name === data.principalSubdivision
            )
            const city = City.getCitiesOfCountry(code ?? '')?.find(
              (c) => c.name === data.city
            )

            newData.province = province
            newData.city = city

            setLocData(newData)
          })
          .catch((err) => {
            console.log(err)
            setError(err)
          })
          .finally(() => {
            setLoading(false)
          })
      },
      (error) => {
        if (error.PERMISSION_DENIED) {
          setDenied(true)
        }
        setError(error.message)
        setLoading(false)
      }
    )
  }

  return {
    data: locData,
    loading,
    error,
    denied,
    execute
  }
}

export default useLazyGeolocation
