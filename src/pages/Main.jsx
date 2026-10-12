import Header from '../components/Header'
import Dashboard from '../components/Dashboard'
import AddTransaction from '../components/AddTransaction'
import ExpenseList from '../components/ExpenseList'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer'

const Main = ({ allTransactions, accessToken, setAccessToken, theme, toggleTheme, selectedDataView, setSelectedDataView, reportingTransactions, refreshData }) => {
  return (
    <>
      <div className="grid min-h-screen grid-rows-[auto_1fr] bg-bg font-sans text-sm text-text">
        <Header
          allTransactions={allTransactions}
          accessToken={accessToken}
          setAccessToken={setAccessToken}
          theme={theme}
          toggleTheme={toggleTheme}
          selectedDataView={selectedDataView}
          setSelectedDataView={setSelectedDataView}
        />
        <main className="mx-auto w-full max-w-[1100px] px-4 py-6 min-[561px]:px-7">
          <Dashboard allTransactions={reportingTransactions} />
          <div className="grid grid-cols-1 items-start gap-5 min-[901px]:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              <AddTransaction
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