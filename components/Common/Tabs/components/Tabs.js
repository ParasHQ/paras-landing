import * as React from 'react'
import PropTypes from 'prop-types'
import { TabsProvider } from '../contex'

const Tabs = ({
  className,
  style,
  children,
  defaultIndex = 0,
  onTabsChange,
}) => {
  return (
    <TabsProvider defaultIndex={defaultIndex} onTabsChange={onTabsChange}>
      <div className={className} style={style}>
        {children}
      </div>
    </TabsProvider>
  )
}

Tabs.propTypes = {
  defaultIndex: PropTypes.number,
  onTabsChange: PropTypes.func,
}

Tabs.defaultProps = {
  defaultIndex: 0,
  className: '',
}

Tabs.displayName = 'Tabs'

export default Tabs
