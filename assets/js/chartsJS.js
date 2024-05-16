// Chart 1: Polar Area Chart
const ctx1 = document.getElementById("chart-1").getContext("2d");
const myChart = new Chart(ctx1, {
  type: "pie",
  data: {
    labels: ["aku", "kamu", "dia"],
    datasets: [
      {
        label: "# of Orders",
        data: [],
        backgroundColor: [
          ,
          ,
          ,
        ],
      },
    ],
  },
  options: {
    responsive: true,
  },
});

// Chart 2: Bar Chart
const ctx2 = document.getElementById("chart-2").getContext("2d");
const myChart2 = new Chart(ctx2, {
  type: "bar",
  data: {
    labels: ["aku", "kamu", "dia"],
    datasets: [
      {
        label: "Pendapatan",
        data: [],
        backgroundColor: [
          ,
          ,
          ,
        ],
      },
    ],
  },
  options: {
    responsive: true,
  },
});
