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
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6 shrink-0 overflow-hidden rounded-3xl border-white/80 bg-white/85 p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 text-center lg:text-left">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-semibold text-slate-950 sm:text-4xl leading-normal"
                  style={{ lineHeight: "normal" }}
                >
                  Salary Management Dashboard
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Review employee pay, department trends, and country-level
                  insights in a clean, comfortable workspace.
                </p>
              </div>
            </div>

            <div
              className="grid w-full grid-cols-3 gap-1 rounded-2xl bg-slate-100/80 p-1 sm:w-auto sm:min-w-[360px]"
              style={{ width: "91%", margin: "auto" }}
            >
              {[HOME, ANALYTICS, INSIGHTS].map((tab) => (
                <button
                  style={{
                    border: "1px solid rgba(148, 163, 184, 0.34)",
                    borderRadius: "20px",
                  }}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl border-0 px-3 py-3 text-xs font-semibold uppercase transition-all sm:text-sm ${
                    activeTab === tab
                      ? "bg-white text-slate-950 shadow-sm"
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

        <section className="flex flex-1 flex-col rounded-3xl bg-white/80 p-4 shadow-[0_22px_60px_-46px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
          {activeTab === HOME && (
            <div className="m-[5%] flex flex-1 flex-col space-y-6">
              <EmployeeTable />
            </div>
          )}

          {activeTab === ANALYTICS && (
            <div className="m-[5%] flex flex-1 flex-col space-y-6 py-6">
              <AnalyticsChart />
            </div>
          )}

          {activeTab === INSIGHTS && (
            <div className="m-[5%] flex flex-1 flex-col space-y-6 py-6">
              <Insights />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
