import { City, Country, State } from 'country-state-city'
import { useEffect, useState } from 'react'
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
    data,
    loading,
    error: geolocationError,
    execute: executeGeoloationRequest,
    denied
  } = useLazyGeolocation()

  const { register, setValue, watch } = useFormContext<IPublishCauseFormProps>()
  const [provinces, setProvinces] = useState<string[]>([])

  const formValues = watch()

  useEffect(() => {
    const countryCode = Country.getAllCountries().find(
      (c) => c.name === formValues.country
    )?.isoCode

    const provinces = State.getStatesOfCountry(countryCode).map((p) => p.name)

    setProvinces(provinces)
  }, [formValues.country])

  const onLocateButtonClick = () => {
    executeGeoloationRequest()
  }

  useEffect(() => {
    console.log('useEffect')
    setValue('country', data.country?.name ?? defaultCountry ?? '')
    setValue('province', data.province?.name ?? defaultProvince ?? '')
    setValue('city', data.city?.name ?? defaultCity ?? '')
  }, [data, defaultCity, defaultCountry, defaultProvince, setValue])

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
              {...register('country')}
            />
            <div className="ml-4">
              <FormDropdown
                label="Province"
                options={provinces}
                {...register('province')}
              />
            </div>
            <div className="ml-4">
              <Input
                placeholder="City"
                required
                {...register('city', {
                  validate: (value) => {
                    return !!City.getCitiesOfCountry(formValues.country)?.find(
                      (c) =>
                        c.name.toLocaleLowerCase() === value.toLocaleLowerCase()
                    )
                  }
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
