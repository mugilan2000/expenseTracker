import React from 'react'
import Header from '../components/Header'
import Dashboard from '../components/Dashboard'
import AddTransaction from '../components/AddTransaction'
import ExpenseList from '../components/ExpenseList'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer'

const Main = ({ allTransactions, isThemeSwitching, accessToken, theme, toggleTheme, selectedDataView, setSelectedDataView, reportingTransactions, refreshData }) => {
  return (
            <>
          <div className={`app ${isThemeSwitching ? "theme-switching" : ""}`}>
            <div className={`theme-overlay ${isThemeSwitching ? "active" : ""}`} />
            <Header
              allTransactions={allTransactions}
              accessToken={accessToken}
              theme={theme}
              toggleTheme={toggleTheme}
              selectedDataView={selectedDataView}
              setSelectedDataView={setSelectedDataView}
            />
            <main>
              <Dashboard allTransactions={reportingTransactions} />
              <div className="content-grid">
                <div>
                  <AddTransaction
                    allTransactions={allTransactions}
                    refreshData={refreshData}
                  />
                  <ExpenseList
                    allTransactions={reportingTransactions}
                    refreshData={refreshData}
                  />
                </div>
                <SideBar
                  allTransactions={allTransactions}
                  reportingTransactions={reportingTransactions}
                />
              </div>
            </main>
            <Footer />
          </div>
          <div id="toast"></div>
        </>
  )
}

export default Main