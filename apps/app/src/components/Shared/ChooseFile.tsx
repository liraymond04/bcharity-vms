import { ChangeEventHandler, FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  id: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

const ChooseFile: FC<Props> = ({ id, onChange }) => {
  const { t } = useTranslation('common')
  return (
    <>
      <label
        htmlFor={id}
        className="modal-close px-4 bg-violet-500 p-2 rounded-lg text-white hover:bg-violet-600"
      >
        {t('Select file(s)')}
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
