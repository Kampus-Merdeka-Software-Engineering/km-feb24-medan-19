// Chart 1: Polar Area Chart
const ctx1 = document.getElementById("chart-1").getContext("2d");
const myChart = new Chart(ctx1, {
  type: "pie",
  data: {
    labels: ["Cappuccino", "Latte", "Espresso", "Americano", "Tea"],
    datasets: [
      {
        label: "# of Orders",
        data: [30, 50, 20, 45, 15],
        backgroundColor: [
          "#AF8F6F",    // Cappuccino
          "#74512D",    // Latte
          "#543310",    //Espresso
          "#151515",    //Americano
          "#F8C794",    // Tea
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
    labels: ["Cappuccino", "Latte", "Espresso", "Americano", "Tea"],
    datasets: [
      {
        label: "Pendapatan",
        data: [1000000, 1500000, 6450000, 3520000, 2580000],
        backgroundColor: [
          "#AF8F6F",    // Cappuccino
          "#74512D",    // Latte
          "#543310",    //Espresso
          "#151515",    //Americano
          "#F8C794",    // Tea
        ],
      },
    ],
  },
  options: {
    responsive: true,
  },
});
