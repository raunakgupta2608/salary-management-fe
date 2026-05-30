import CountrySalarySummary from "./CountrySalarySummary";
import AverageSalaryByJobTitle from "./AverageSalaryByJobTitle";

const Insights = () => {
  // useEffect(() => {
  //   fetchData();
  // }, []);

  // async function fetchData() {
  //   try {
  //     // const headCount = await apiClient.get("/analytics/headcount");
  //     // const outliersSUmmary = await apiClient.get("/analytics/outliers");
  //     // console.log(headCount?.data?.length, outliersSUmmary?.data?.length);
  //   } catch (error) {
  //     console.log("abcd error", error);
  //   }
  // }

  return (
    <div>
      <CountrySalarySummary />
      <AverageSalaryByJobTitle />
    </div>
  );
};

export default Insights;
