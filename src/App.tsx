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
    <main className="min-h-screen text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6 overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 text-center lg:text-left">
              <p className="inline-flex rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase text-emerald-700 ring-1 ring-emerald-100">
                Salary workspace
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                  Salary Management Dashboard
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Review employee pay, department trends, and country-level
                  insights in a clean, comfortable workspace.
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1 sm:w-auto sm:min-w-[360px]">
              {[HOME, ANALYTICS, INSIGHTS].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-3 py-3 text-xs font-semibold uppercase transition-all sm:text-sm ${
                    activeTab === tab
                      ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
                  }`}
                >
                  {tab === HOME
                    ? "Home"
                    : tab === ANALYTICS
                      ? "Analytics"
                      : "Insights"}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_22px_60px_-46px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
          {activeTab === HOME && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5 shadow-sm">
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Search and explore employee data with steady contrast,
                  readable spacing, and gentle highlights.
                </p>
              </div>
              <EmployeeTable />
            </div>
          )}

          {activeTab === ANALYTICS && (
            <div className="space-y-6 py-6">
              <AnalyticsChart />
            </div>
          )}

          {activeTab === INSIGHTS && (
            <div className="space-y-6 py-6">
              <Insights />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
