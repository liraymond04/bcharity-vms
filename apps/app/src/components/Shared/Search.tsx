import { useRouter } from 'next/router'
import { ChangeEvent, FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Input } from '../UI/Input'
import useOnClickOutside from '../utils/hooks/useClickOnOutside'

interface Props {
  className?: string | undefined
}

const Search: FC<Props> = ({ className }) => {
  const { push, pathname, query } = useRouter()
  const [searchText, setSearchText] = useState<string>('')
  const dropdownRef = useRef(null)
  const { t } = useTranslation('common')

  useOnClickOutside(dropdownRef, () => setSearchText(''))

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value
    setSearchText(keyword)
  }

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    const keyword = evt.target.value
    setSearchText('')
  }

  return (
    <div aria-hidden="true" className={className}>
      <form onSubmit={handleKeyDown} className="w-full">
        <Input
          type="text"
          className="py-2 px-3 text-sm"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
        />
      </form>
    </div>
  )
}

export default Search
