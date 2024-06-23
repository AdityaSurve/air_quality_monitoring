import React from "react";
import Chart from "react-apexcharts";

class PollutionChart extends React.Component {
  constructor(props) {
    super(props);

    const data = this.props.data || {};
    const O3 = data.O3 ? data.O3.map((entry) => entry.AQI) : [];
    const PM25 = data["PM2.5"] ? data["PM2.5"].map((entry) => entry.AQI) : [];
    const PM10 = data.PM10 ? data.PM10.map((entry) => entry.AQI) : [];
    const labels = data.O3 ? data.O3.map((entry) => entry.Timestamp) : [];

    this.originalData = [data.O3, data["PM2.5"], data.PM10];

    console.log(this.originalData);
    this.state = {
      series: [
        { name: "O3", data: O3 },
        { name: "PM2.5", data: PM25 },
        { name: "PM10", data: PM10 },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              enabled: false,
            },
          },
        },
        stroke: {
          width: 0,
          colors: ["#000000"],
        },
        tooltip: {
          theme: "dark",
          style: {
            colors: ["#000"],
          },
          y: {
            formatter: function (val, opts) {
              const index = opts.dataPointIndex;
              const seriesIndex = opts.seriesIndex;
              const originalData = this.originalData[seriesIndex][index];
              const lat = originalData.Latitude;
              const lon = originalData.Longitude;
              const area = originalData.ReportingArea;
              const cat = originalData.CategoryNumber;
              const cat_name = originalData.CategoryName;
              const colors = [
                "#44DDA0",
                "#FFD700",
                "#FFA500",
                "#FF6347",
                "#8B0000",
                "#800080",
              ];

              return `<div class="">
                <div class="font-semibold text-xl" style="color: ${
                  colors[cat - 1]
                }">${val}</div>
                <div class="grid grid-cols-2 gap-2 mt-3">
                <div className="flex flex-col">
                <div class="text-xs w-full">Latitude</div>
                <div class="text-sm text-gray-300">${lat}</div>
                </div>
                <div className="flex flex-col">
                <div class="text-xs w-full">Longitude</div>
                <div class="text-sm text-gray-300">${lon}</div>
                </div>
                <div className="flex flex-col">
                <div class="text-xs w-full">Area</div>
                <div class="text-sm text-gray-300 w-20 truncate">${area}</div>
                </div>
                <div className="flex flex-col">
                <div class="text-xs w-full">Category</div>
                <div class="text-sm text-gray-300">${cat_name}</div>
                </div>
                </div>
              </div>`;
            }.bind(this),
            title: {
              formatter: function (seriesName) {
                // return html
                return `<div class="font-semibold">${seriesName}</div>`;
              },
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: labels,
          labels: {
            show: false,
          },
        },
        yaxis: {
          title: {
            text: undefined,
          },
          show: false,
        },
        grid: {
          show: false,
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          labels: {
            colors: "#ffffff",
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={350}
        />
      </div>
    );
  }
}

export default PollutionChart;
