import * as React from 'react'

const InputText = ({ className = '', isError = false, ...rest }) => {
  const inputBaseStyle = `${className} input-text flex items-center relative w-full px-3 py-2 rounded-lg`
  const inputBgStyle = 'bg-white bg-opacity-10'
  const inputBorderStyle = 'outline-none '
  const inputTextStyle = 'text-white text-opacity-90 text-body text-base '

  const inputStyle = `${inputBaseStyle} ${inputBgStyle} ${inputBorderStyle} ${inputTextStyle} ${
    isError ? 'input-text--error' : ''
  }`

  return <textarea className={inputStyle} {...rest} />
}

InputText.displayName = 'InputText'

export default InputText
