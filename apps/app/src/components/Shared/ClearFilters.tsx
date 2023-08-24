import { FC } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Properties of {@link ClearFilters}
 */
export interface ClearFiltersProps {
  /**
   * Function that runs when the component button is clicked
   */
  onClick: Function
}

/**
 * A component that styles a button used for clearing filters
 *
 * Note: this component does not provide clearing filter functionality,
 * it only provides the styling and button label
 *
 * @example ClearFilters component used in {@link Organizations}
 * ```tsx
 * <div className="flex flex-wrap gap-y-5 justify-around w-[420px] items-center">
 *   <div className="h-[50px] z-10 ">
 *     <DashboardDropDown
 *       label={t('filters')}
 *       options={['Option 1', 'Option 2', 'Option 3']}
 *       onClick={(c) => setSelectedCategory(c)}
 *       selected={selectedCategory}
 *     ></DashboardDropDown>
 *   </div>
 *   <ClearFilters onClick={() => setSelectedCategory('')} />
 * </div>
 * ```
 */
const ClearFilters: FC<ClearFiltersProps> = ({ onClick }) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.clear-filters'
  })
  return (
    <button
      className="ml-3 min-w-[110px] h-fit text-red-500 bg-[#ffc2d4] border-red-500 border-2 rounded-md px-2 hover:bg-red-500 hover:text-white hover:cursor-pointer dark:text-[#fff2f2] dark:text-opacity-80 dark:bg-[#555591] dark:border-[#20203f] dark:hover:text-opacity-100 hover:dark:bg-indigo-800 duration-200 active:bg-red-800 active:border-red-800 active:dark:bg-indigo-950 active:dark:border-indigo-950"
      onClick={() => {
        onClick()
      }}
      suppressHydrationWarning
    >
      {t('label')}
    </button>
  )
}

export default ClearFilters
