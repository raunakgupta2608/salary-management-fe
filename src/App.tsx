import EmployeeTable from "./components/EmployeeTable";

function App() {
  return (
    <main className="min-h-screen bg-[#f5ede4] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-[5%]">
        <section className="mb-8 overflow-hidden rounded-[2rem] border border-amber-200 bg-[#fbf3eb] p-6 shadow-[0_25px_50px_-20px_rgba(120,87,42,0.25)]">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Salary Management Dashboard
              </h1>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(120,87,42,0.22)]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm text-slate-600">
              Use the search box to filter by name, role, department, email, or
              country.
            </p>
          </div>

          <EmployeeTable />
        </section>
      </div>
    </main>
  );
}

export default App;
