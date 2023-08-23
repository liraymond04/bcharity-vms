import FormDropdown from '../Shared/FormDropdown'
import { Button } from './Button'
import { Input } from './Input'

/**
 * Properties of {@link DisabledLocationDropdowns}
 */
export interface IDisabledLocationDropdownsProps {
  /**
   * String of location country
   */
  country: string
  /**
   * String of location province
   */
  province: string
  /**
   * String of location city
   */
  city: string
}

/**
 * Component to display a disabled location dropdown (read only).
 *
 * To use a location dropdown as an input, use {@link LocationFormComponent}
 */
const DisabledLocationDropdowns: React.FC<IDisabledLocationDropdownsProps> = ({
  country,
  province,
  city
}) => {
  return (
    <div className="">
      <div className="flex items-center">
        <FormDropdown
          label="Country"
          options={[country]}
          value={country}
          disabled
        />
        <div className="ml-4">
          <FormDropdown
            label="Province"
            options={[province]}
            value={province}
            disabled
          />
        </div>
        <div className="ml-4">
          <Input placeholder="City" required value={city} disabled />
        </div>
        <Button type="button" disabled className="ml-auto">
          Locate
        </Button>
      </div>
    </div>
  )
}

export default DisabledLocationDropdowns
