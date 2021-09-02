import * as React from 'react'

const useProviderTabs = ({ defaultIndex = 0, onTabsChange }) => {
  const [currentPage, setCurrentPage] = React.useState(defaultIndex)

  function setPage(value) {
    setCurrentPage(value)
    if (onTabsChange && currentPage !== value) {
      onTabsChange(value)
    }
  }

  return {
    currentPage,
    setPage,
  }
}

const TabsContext = React.createContext({
  currentPage: 0,
  setPage: () => null,
})

export const TabsProvider = ({ children, ...rest }) => {
  const provider = useProviderTabs({ ...rest })
  return (
    <TabsContext.Provider value={provider}>{children}</TabsContext.Provider>
  )
}

export function useTabs() {
  const Tabs = React.useContext(TabsContext)
  if (!Tabs) {
    throw new Error('Tabs Provider is undefined.')
  }
  return Tabs
}
