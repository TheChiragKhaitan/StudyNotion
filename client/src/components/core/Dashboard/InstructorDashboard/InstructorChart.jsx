import React from "react";
import { Pie } from "react-chartjs-2"
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Chart, registerables } from "chart.js"

Chart.register(...registerables);

const InstructorChart = ({ details, currentChart }) => {
//   ChartJS.register(ArcElement, Tooltip, Legend);
    
  const randomColor = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)})`
      );
    }
    return colors;
  };
  
  const StudentsData = {
    labels: details?.map((course) => course?.courseName),
    
    datasets: [
      {
        
        data: details?.map((course) => course?.totalStudentsEnrolled),
        backgroundColor: randomColor(details?.length),
        
      },
    ],
  };

  const RevenueData = {
    labels: details?.map((course) => course?.courseName),
    datasets: [
      {
       
        data: details?.map((course) => course?.totalAmountGenerated),
        backgroundColor: randomColor(details?.length),
        
      },
    ],
  };

  return (
    <div>
      <div className="mt-8 ">
      {console.log("Value is",currentChart)}
        {/* change label position extreme right and increase gap and change chart size */}
        <Pie
          data={currentChart === 'revenue' ? RevenueData : StudentsData}
          options={{
            plugins: {
              legend: {
                position: "right",
                labels: {
                  boxWidth: 10,
                  boxHeight: 10,
                  padding: 20,
                  font: {
                    size: 12,
                  },
                },
              },
            },
            aspectRatio: 2,
          }}
        />
      </div>
    </div>
  );
};

export default InstructorChart;
