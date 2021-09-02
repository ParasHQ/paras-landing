import * as React from 'react'

const TabList = ({ children, className, style }) => {
  const tabListStyle = `tab-list-border flex items-start relative gap-3 ${className}`

  return (
    <div className={tabListStyle} style={style}>
      {children &&
        Array.isArray(children) &&
        children.map((child, index) =>
          React.cloneElement(child, { index, key: index.toString() })
        )}
    </div>
  )
}

TabList.defaultProps = {
  className: '',
}

export default TabList
