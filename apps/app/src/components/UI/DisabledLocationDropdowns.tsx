import FormDropdown from '../Shared/FormDropdown'
import { Button } from './Button'
import { Input } from './Input'

interface ILocationFormComponentProps {
  country: string
  province: string
  city: string
}

const DisabledLocationDropdowns: React.FC<ILocationFormComponentProps> = ({
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
