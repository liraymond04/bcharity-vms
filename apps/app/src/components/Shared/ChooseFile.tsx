import { ChangeEventHandler, FC } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Properties of {@link ChooseFile}
 */
export interface ChooseFileProps {
  /**
   * Used in the component label's htmlFor attribute
   */
  id: string
  /**
   * Function that runs when the input component changes
   */
  onChange: ChangeEventHandler<HTMLInputElement>
}

/**
 * A component that displays an input component for choosing files
 *
 * @example ChooseFile used in the {@link components.UserSettings.UserHome.Picture} component
 * ```tsx
 * <ChooseFile
 *   id="avatar"
 *   onChange={(evt: ChangeEvent<HTMLInputElement>) =>
 *     handleUpload(evt)
 *   }
 * />
 * ```
 */
const ChooseFile: FC<ChooseFileProps> = ({ id, onChange }) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.choose-file'
  })
  return (
    <>
      <label
        htmlFor={id}
        className="modal-close px-4 bg-violet-500 p-2 rounded-lg text-white hover:bg-violet-600"
        suppressHydrationWarning
      >
        {t('select')}
      </label>
      <input
        id={id}
        className="pr-1 text-sm text-gray-700 bg-white rounded-xl border border-gray-300 shadow-sm cursor-pointer dark:text-white dark:bg-gray-800 focus:outline-none dark:border-gray-700/80 focus:border-brand-400"
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: 'none' }}
      />
    </>
  )
}

export default ChooseFile
