import { Card } from '@/components/UI/Card'
import { LogVhrRequestMetadata } from '@/lib/metadata'

interface IVHRRequestProps {
  selected?: boolean
  value: LogVhrRequestMetadata
  onClick: VoidFunction
}

const VolunteerVHRRequest: React.FC<IVHRRequestProps> = ({
  selected,
  value,
  onClick
}) => {
  return (
    <Card>
      <div
        className={`${
          selected
            ? 'bg-blue-100 dark:bg-violet-500'
            : 'bg-violet-200 dark:bg-Within dark:bg-opacity-10'
        } flex items-center shadow-sm shadow-black px-5 py-2`}
        onClick={onClick}
      >
        <p>
          {value.opportunity.startDate} - {value.opportunity.endDate}
        </p>
        <p className="ml-8 font-bold">{value.hoursToVerify} VHR</p>
        <p className="ml-8 font-bold">{value.from.handle}</p>
        <p className="ml-8 font-bold">{value.opportunity.name}</p>
      </div>
    </Card>
  )
}

export default VolunteerVHRRequest
