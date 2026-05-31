import CountrySalarySummary from "./CountrySalarySummary";
import AverageSalaryByJobTitle from "./AverageSalaryByJobTitle";

const Insights = () => {
  return (
    <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-10 lg:space-y-0">
      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <CountrySalarySummary />
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <AverageSalaryByJobTitle />
      </div>
    </div>
  );
};

export default Insights;
