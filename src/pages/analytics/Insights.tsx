import CountrySalarySummary from "./CountrySalarySummary";
import AverageSalaryByJobTitle from "./AverageSalaryByJobTitle";

const Insights = () => {
  return (
    <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <CountrySalarySummary />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <AverageSalaryByJobTitle />
      </div>
    </div>
  );
};

export default Insights;
