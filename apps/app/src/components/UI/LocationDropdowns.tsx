import { City, Country, State } from 'country-state-city'
import { useFormContext } from 'react-hook-form'

import useLazyGeolocation from '@/lib/lens-protocol/useLazyGeolocation'
import { IFormLocation } from '@/lib/types'

import Error from '../Dashboard/Modals/Error'
import FormDropdown from '../Shared/FormDropdown'
import { Button } from './Button'
import { Input } from './Input'
import { Spinner } from './Spinner'

interface ILocationFormComponentProps {
  defaultCountry?: string
  defaultProvince?: string
  defaultCity?: string
}

const LocationFormComponent: React.FC<ILocationFormComponentProps> = ({
  defaultCountry,
  defaultProvince,
  defaultCity
}) => {
  const {
    loading,
    error: geolocationError,
    execute: executeGeoloationRequest,
    denied
  } = useLazyGeolocation()

  const { register, setValue, watch } = useFormContext<IFormLocation>()

  const country = watch('country')

  const provinces =
    State.getStatesOfCountry(
      Country.getAllCountries().find((c) => c.name === country)?.isoCode
    ).map((p) => p.name) ?? []

  const onLocateButtonClick = () => {
    executeGeoloationRequest((value) => {
      setValue('country', value.country?.name ?? defaultCountry ?? '', {
        shouldValidate: true
      })
      setValue('province', value.province?.name ?? defaultProvince ?? '', {
        shouldValidate: true
      })
      setValue('city', value.city?.name ?? defaultCity ?? '', {
        shouldValidate: true
      })
    })
  }

  const validateCity = (value: string, _formValues: IFormLocation) => {
    const countryCode = Country.getAllCountries().find(
      (c) => c.name === _formValues.country
    )?.isoCode

    const provinceCode = State.getStatesOfCountry(countryCode).find(
      (p) => p.name === _formValues.province
    )?.isoCode

    if (!provinceCode || !countryCode) return false

    const cities = City.getCitiesOfState(countryCode, provinceCode)
    return !!cities.find((c) => c.name.toLowerCase() === value.toLowerCase())
  }

  return (
    <div className="">
      <div className="flex items-center">
        {!loading || denied ? (
          <>
            <FormDropdown
              label="Country"
              options={Country.getAllCountries().map((c) => c.name)}
              required
              {...register('country', {
                validate: {
                  required: (v) => !!v
                }
              })}
            />
            <div className="ml-4">
              <FormDropdown
                label="Province"
                options={provinces}
                required
                {...register('province', {
                  validate: {
                    required: (v) => !!v
                  }
                })}
              />
            </div>
            <div className="ml-4">
              <Input
                placeholder="City"
                required
                {...register('city', {
                  validate: { city: validateCity },
                  deps: ['province, city']
                })}
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
    </div>
  )
}

export default LocationFormComponent
