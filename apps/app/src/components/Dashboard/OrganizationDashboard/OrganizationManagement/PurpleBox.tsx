import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

import { getFormattedDate } from './VolunteerManagement'

/**
 * Properties of {@link PurpleBox}
 */
export interface PurpleBoxProps {
  /**
   * Whether the current component has been selected
   */
  selected?: boolean
  /**
   * Profile handle of volunteer
   */
  userName: string
  /**
   * Date of volunteer join date or application created
   */
  dateCreated: string
  /**
   * Function to run when the component is clicked
   */
  onClick?: MouseEventHandler<HTMLDivElement>
  /**
   * String identifier for which tab the item is from
   */
  tab?: string
}

/**
 * Component to display individual items for use in a list.
 *
 * Used in {@link VolunteerManagementTab} to display volunteers
 * and pending applications.
 */
const PurpleBox: React.FC<PurpleBoxProps> = ({
  selected,
  userName,
  dateCreated,
  onClick,
  tab
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.management'
  })
  const boxClassName = selected
    ? 'bg-blue-100 dark:bg-violet-500 scale-105'
    : 'bg-violet-200 dark:bg-Within dark:bg-opacity-10'
  return (
    <div
      className={`items-center shadow-sm shadow-black px-5 mx-5 my-3 h-16 py-2 hover:cursor-pointer transition duration-150 hover:scale-105 ${boxClassName}`}
      onClick={onClick}
    >
      <div>{userName}</div>
      <div className="flex justify-end my-3">
        <div className="text-sm font-extralight" suppressHydrationWarning>
          {tab === 'all' && t('date-joined')}
          {tab === 'applications' && t('date-created')}&nbsp;
        </div>
        <div className="text-sm font-extralight">
          {getFormattedDate(dateCreated)}
        </div>
      </div>
    </div>
  )
}

export default PurpleBox
