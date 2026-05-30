import { useState } from "react";
import EmployeeTable from "./pages/EmployeeTable";
import AnalyticsChart from "./pages/AnalyticsChart";
import Insights from "./pages/analytics/Insights";

const HOME = "home";
const INSIGHTS = "insights";
const ANALYTICS = "analytics";

function App() {
  const [activeTab, setActiveTab] = useState(HOME);

  return (
    <main className="min-h-screen bg-[#f5ede4] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-[5%]">
        <section className="mb-8 overflow-hidden rounded-[2rem] border border-amber-200 bg-[#fbf3eb] p-6 shadow-[0_25px_50px_-20px_rgba(120,87,42,0.25)]">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="font-semibold tracking-tight text-slate-950">
              Salary Management Dashboard
            </h1>

            <div className="flex bg-[#f5e6d8] rounded-[20px] border-0">
              <button
                onClick={() => setActiveTab(HOME)}
                className={`px-4 w-[250px] py-2 text-sm font-medium transition-colors bg-[#f5e6d8] ${
                  activeTab === HOME
                    ? "bg-white text-slate-950 border-b-2 border-amber-600 rounded-[20px]"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setActiveTab(ANALYTICS)}
                className={`px-4 w-[250px] py-2 text-sm font-medium transition-colors bg-[#f5e6d8] ${
                  activeTab === ANALYTICS
                    ? "bg-white text-slate-950 border-b-2 border-amber-600 rounded-[20px]"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab(INSIGHTS)}
                className={`px-4 w-[250px] py-2 text-sm font-medium transition-colors bg-[#f5e6d8] ${
                  activeTab === INSIGHTS
                    ? "bg-white text-slate-950 border-b-2 border-amber-600 rounded-[20px]"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Insights
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(120,87,42,0.22)]">
          {activeTab === HOME && (
            <div>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm text-slate-600">
                  Use the search box to filter by name, role, department, email,
                  or country.
                </p>
              </div>
              <EmployeeTable />
            </div>
          )}

          {activeTab === ANALYTICS && (
            <div className="py-6">
              <AnalyticsChart />
            </div>
          )}

          {activeTab === INSIGHTS && (
            <div className="py-6">
              <Insights />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
