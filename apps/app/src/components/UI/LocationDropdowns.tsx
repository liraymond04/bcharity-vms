import { City, Country, State } from 'country-state-city'
import { useFormContext } from 'react-hook-form'

import useLazyGeolocation from '@/lib/lens-protocol/useLazyGeolocation'

import Error from '../Dashboard/Modals/Error'
import { IPublishCauseFormProps } from '../Dashboard/Modals/PublishCauseModal'
import Divider from '../Shared/Divider'
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

  const { register, setValue, watch } = useFormContext<IPublishCauseFormProps>()

  const formValues = watch()

  console.log('form province', formValues.province)

  const provinces =
    State.getStatesOfCountry(
      Country.getAllCountries().find((c) => c.name === formValues.country)
        ?.isoCode
    ).map((p) => p.name) ?? []

  const onLocateButtonClick = () => {
    executeGeoloationRequest((value) => {
      setValue('country', value.country?.name ?? defaultCountry ?? '')
      setValue('province', value.province?.name ?? defaultProvince ?? '')
      setValue('city', value.city?.name ?? defaultCity ?? '')
    })
  }

  const validateCity = (value: string, _formValues: IPublishCauseFormProps) => {
    const countryCode = Country.getAllCountries().find(
      (c) => c.name === _formValues.country
    )?.isoCode

    const provinceCode = State.getStatesOfCountry(countryCode).find(
      (p) => p.name === _formValues.province
    )?.isoCode

    if (!provinceCode || !countryCode) return false

    const cities = City.getCitiesOfState(countryCode, provinceCode)
    console.log(cities)
    return !!cities.find((c) => c.name.toLowerCase() === value.toLowerCase())
  }

  return (
    <div className="my-4">
      <Divider />
      <p>Location</p>
      <div className="flex">
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
      <Divider />
    </div>
  )
}

export default LocationFormComponent
