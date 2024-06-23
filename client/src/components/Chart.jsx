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

    this.originalData = {
      O3: this.props.data.O3,
      PM25: this.props.data["PM2.5"],
      PM10: this.props.data.PM10,
    };

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
            formatter: function (val) {
              return val;
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
