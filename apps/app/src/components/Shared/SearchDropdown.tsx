import React from 'react'

interface IFilterDropdownProps {
  label: string
  options: string[]
  onChange: (string: string) => void
}

const FilterDropdown: React.FC<IFilterDropdownProps> = ({
  label,
  options,
  onChange
}) => {
  return (
    <div className="flex items-center">
      <div className="text-md mr-3">{label}</div>
      <select
        className="w-30 h-10 bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
        onChange={(e) => {
          onChange(e.target.value)
        }}
      >
        <option key="_none" value="">
          None
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterDropdown
