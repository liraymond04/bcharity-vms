import { Country, State } from 'country-state-city'
import { useEffect, useState } from 'react'

import useLazyGeolocation from '@/lib/lens-protocol/useLazyGeolocation'

import Error from '../Dashboard/Modals/Error'
import Divider from '../Shared/Divider'
import FilterDropdown from '../Shared/FilterDropdown'
import { Button } from './Button'
import { Input } from './Input'
import { Spinner } from './Spinner'

interface ILocationDropdownsProps {
  onChange: (data: string) => void
}

const LocationDropdowns: React.FC<ILocationDropdownsProps> = ({ onChange }) => {
  const {
    data,
    loading,
    error: geolocationError,
    execute: executeGeoloationRequest,
    denied
  } = useLazyGeolocation()

  const [country, setCountry] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')

  const getProvinces = () => {
    if (!country) return []

    const countryCode = Country.getAllCountries().find(
      (c) => c.name === country
    )?.isoCode

    return State.getStatesOfCountry(countryCode).map((p) => p.name)
  }

  const onLocateButtonClick = () => {
    executeGeoloationRequest()
  }

  useEffect(() => {
    setCountry(data.country?.name ?? '')
    setProvince(data.province?.name ?? '')
    setCity(data.city?.name ?? '')
  }, [data])

  useEffect(() => {
    const locationString = `${country},${province},${city}`
    onChange(locationString)
  }, [country, province, city, onChange])

  return (
    <div className="my-4">
      <Divider />
      <p>Location</p>
      <div className="flex">
        {!loading || denied ? (
          <>
            <FilterDropdown
              onChange={(val) => {
                setCountry(val)
                setCity('')
              }}
              label="Country"
              options={Country.getAllCountries().map((c) => c.name)}
              value={country}
            />
            <div className="ml-4">
              <FilterDropdown
                onChange={(val) => setProvince(val)}
                label="Province"
                options={getProvinces()}
                value={province}
              />
            </div>
            <div className="ml-4">
              <Input
                value={city}
                placeholder="City"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </>
        ) : (
          <Spinner />
        )}
        <Button
          onClick={onLocateButtonClick}
          type="button"
          disabled={loading}
          className="ml-auto"
        >
          Locate
        </Button>
      </div>
      {denied && (
        <Error
          message={
            'Location access denied. Enable it to allow location autofill and try again'
          }
        />
      )}
      {geolocationError && (
        <Error
          message={`An unexpected error occured: ${geolocationError}. Please try again.`}
        />
      )}
      <Divider />
    </div>
  )
}

export default LocationDropdowns
