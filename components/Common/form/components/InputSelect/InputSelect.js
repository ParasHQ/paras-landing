import * as React from 'react'

const InputSelect = ({
  className = '',
  isError = false,
  options = [{}],
  ...rest
}) => {
  const inputBaseStyle = `input-text flex items-center relative w-full px-3 py-2 rounded-lg`
  const inputBgStyle = 'bg-white bg-opacity-10'
  const inputBorderStyle = 'outline-none '
  const InputSelectStyle = 'text-white text-opacity-90 text-body text-base '

  const inputStyle = `input-select ${inputBaseStyle} ${inputBgStyle} ${inputBorderStyle} ${InputSelectStyle} ${
    isError ? 'input-text--error' : ''
  }`

  const selectWrapper = `${className} select-wrapper w-full relative`

  return (
    <div className={selectWrapper}>
      <select className={inputStyle} {...rest}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

InputSelect.displayName = 'InputSelect'

export default InputSelect
