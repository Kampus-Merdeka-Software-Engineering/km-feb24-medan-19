Chart.defaults.font.family = 'Montserrat'; // Mengatur font default chart
Chart.register(ChartDataLabels);


function logSubmit(event) {
  //log.textContent = `Form Submitted! Timestamp: ${event.timeStamp}`;
  // mesti bisa ambil filter apa aja
  event.preventDefault();
  const formData = new FormData(event.target);
  // console.log(formData.get('tanggal'));

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  const filteredData = datajson.filter((x) => x['transaction_date'] == formData.get('tanggal'));

  console.log(filteredData);
  tampilkangrafik1(filteredData);
}

// -------- Chart 1 -----------

let chart1 = null;
function tampilkangrafik1(data) {
  const productTypeObject = data.reduce((ac, current) => {

    let c = ac[current.product_category] || 0;

    c += 1
    ac[current.product_category] = c;

    return ac;
  }, {});

  // check dulu klo chart1 masih kosong
  if (chart1 == null) {
    chart1 = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: Object.keys(productTypeObject),
        datasets: [
          {
            data: Object.values(productTypeObject),
            backgroundColor: [
              "#4B2818",
              "#966C4D",
              "#C58C58",
              "#6F798C",
              "#496157",
              "#584B77",
              "#332211",
              "#D9CAB3",
              "#444444",
            ],
          },
        ],
      },
      options: {
        plugins: {
          datalabels: { // Konfigurasi datalabels
            formatter: (value, ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(2) + '%';
              return percentage;
            },
            color: 'grey',
            anchor: 'end',       // Jangkar label di ujung atas bar
            align: 'top',        // Sejajarkan label di atas jangkar
            offset: -10,        // Jarak antara label dan bar (nilai negatif untuk di atas)
            formatter: Math.round   // Perataan teks label
          },
          legend: { display: false },
          title: {
            display: true,
            text: 'Transaction by Product Category',
            font: { size: 16 },
            position: 'top'
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              maxRotation: 45,   // Rotasi maksimum (dalam derajat)
              minRotation: 45,   // Rotasi minimum (dalam derajat)
            }
          }, // Bagian ini untuk mengatur skala
          y: {
            min: 0,  // Nilai minimum sumbu y (bisa disesuaikan)
            max: 16000, // Nilai maksimum sumbu y (bisa disesuaikan)
            beginAtZero: true, // Opsional: mulai sumbu y dari nol
            ticks: {
              // Pengaturan khusus untuk sumbu y
              stepSize: 1000, // Interval antara setiap tick
              callback: function (value, index, ticks) {
                // Hanya tampilkan nilai-nilai tertentu
                return [0, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000].includes(value) ? value : null;
              }
            }
          }
        }
      }

    });

    return;
  }

  chart1.data = {
    labels: Object.keys(productTypeObject),
    datasets: [
      {
        label: "# of Orders",
        data: Object.values(productTypeObject),
        backgroundColor: [
          "#4B2818",
          "#966C4D",
          "#C58C58",
          "#6F798C",
          "#496157",
          "#584B77",
          "#332211",
          "#D9CAB3",
          "#444444",
        ],
      },
    ],
  };

  // https://www.chartjs.org/docs/latest/developers/api.html
  chart1.update();
}

const recentOrdersContainer = document.querySelector('.recentOrders'); // Select the correct container
const ctx1 = document.getElementById("chart-1").getContext("2d");
const form = document.getElementById("formtanggal");
const ctx2 = document.getElementById("chart-2").getContext("2d");
const ctx3 = document.getElementById("chart-3").getContext("2d");
const ctx4 = document.getElementById("chart-4").getContext("2d");
const ctx5 = document.getElementById("chart-5").getContext("2d");


let datajson = null

form.addEventListener("submit", logSubmit);


// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

document.addEventListener('DOMContentLoaded', () => {

  // Populate recent orders list

  fetch('/assets/json/data.json')
    .then(response => response.json())
    .then(coffeeData => {
      datajson = coffeeData
      // total revenue 

      // console.log(coffeeData)

      // fungsi reduce wajib punya 2 parameter
      // 1. fungsi proses
      // 2. nilai awal
      // 
      const totalRevenue = datajson.reduce((ac, current) => {
        // 0.18 + '1'
        // 0.18 + 1
        return ac + parseInt(current['Revenue']);
      }, 0);

      const revenueNumber = document.querySelector('.revenue-number');
      revenueNumber.textContent = totalRevenue;

      // const productTypeObject = {
      //   'category': 100,
      //   ''
      // };

      // 1. Menghitung Total Customer (Unique Customer)
      const totalCustomer = datajson.reduce((uniqueCustomers, currentTransaction) => {
        uniqueCustomers.add(currentTransaction.transaction_id);
        return uniqueCustomers;
      }, new Set()).size;

      const customerNumber = document.querySelector('.customer-number');
      customerNumber.textContent = totalCustomer;


      // -------- Chart 2 -----------

      // Fungsi untuk menampilkan chart (asumsikan fungsi ini sudah didefinisikan)
      tampilkangrafik1(datajson);

      // Agregasi data berdasarkan store_location dan product_category
      const storeProductTransactions = datajson.reduce((acc, current) => {
        const store = current.store_location;
        const product = current.product_category;
        const key = `${store}-${product}`;

        acc[key] = (acc[key] || 0) + parseInt(current.transaction_qty);
        return acc;
      }, {});

      // Array untuk menyimpan data chart
      const chartData = [];

      // Array warna yang diinginkan
      const colors = ["#6F798C", "#966C4D", "#C58C58"];

      // Mendapatkan daftar unik store
      const uniqueStores = [...new Set(datajson.map(item => item.store_location))];

      // Membuat 3 cabang (kategori) secara manual
      const categories = ["Coffee beans", "Loose Tea", "Packaged Chocolate", "Coffee"];

      // Iterasi untuk membuat dataset per store
      for (let i = 0; i < uniqueStores.length; i++) {
        const store = uniqueStores[i];
        const colorIndex = i % colors.length; // Dapatkan indeks warna secara bergantian

        const storeData = [];
        for (const category of categories) {
          const key = `${store}-${category}`;
          storeData.push(storeProductTransactions[key] || 0);
        }

        chartData.push({
          label: store,
          data: storeData,
          backgroundColor: colors[colorIndex], // Gunakan warna berdasarkan indeks
          borderColor: colors[colorIndex],    // Gunakan warna berdasarkan indeks
          borderWidth: 1
        });
      }

      // Chart 2: Bar Chart
      const ctx2 = document.getElementById("chart-2").getContext("2d");
      const myChart2 = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: categories,
          datasets: chartData
        },
        options: {
          plugins: {
            datalabels: {
              display: false
            },
            title: {
              display: true,
              text: 'Total Transactions per Product Category per Store',
              position: 'top',
              font: {
                size: 16,
              },
              padding: {
                top: 20,
                bottom: 10
              }
            },
            legend: {
              display: true,
              position: 'right'
            }
          },
          scales: {
            x: {
              ticks: {
                maxRotation: 45,   // Rotasi maksimum (dalam derajat)
                minRotation: 45,   // Rotasi minimum (dalam derajat)
              },
              stacked: true
            },
            y: {
              beginAtZero: true,
              stacked: true
            }
          }
        }
      });

      // -------- Chart 3 -----------

      // Chart-3 (Pie Chart - Revenue for Each Store)
      tampilkangrafik1(datajson)
      const storeRevenue = datajson.reduce((acc, current) => {
        const storeLocation = current.store_location;
        const revenue = parseFloat(current.Revenue); // Ambil nilai revenue

        // Jika storeLocation belum ada di accumulator, inisialisasi dengan 0
        acc[storeLocation] = (acc[storeLocation] || 0) + revenue; // Tambahkan revenue

        return acc;
      }, {});

      const ctx3 = document.getElementById("chart-3").getContext("2d");

      const myChart3 = new Chart(ctx3, {
        type: "pie",
        data: {
          labels: Object.keys(storeRevenue),
          datasets: [
            {
              label: "Store Location",
              data: Object.values(storeRevenue),
              backgroundColor: ["#6F798C", "#966C4D", "#C58C58"],
            },
          ],
        },
        options: {
          plugins: {
            datalabels: { // Konfigurasi datalabels
              formatter: (value, ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(2) + '%';
                return percentage;
              },
              color: 'white', // Warna teks label
              anchor: 'center', // Posisi label (tengah slice)
              align: 'center'   // Perataan teks label
            },
            title: {
              display: true,
              text: 'Revenue for Each Store',
              position: 'top',
              font: { size: 16 },
              padding: { top: 20, bottom: 10 }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || ''; // Ambil label slice (store location)
                  const value = context.parsed;     // Ambil nilai data slice
                  const total = context.dataset.data.reduce((a, b) => a + b, 0); // Hitung total data
                  const percentage = ((value / total) * 100).toFixed(2) + '%';  // Hitung persentase
                  return `${label}: ${value} (${percentage})`; // Kembalikan label dengan nilai dan persentase
                }
              }
            }
          }
        }
      });

      // -------- Chart 4 -----------

      // Fungsi untuk menampilkan chart (asumsikan fungsi ini sudah didefinisikan)
      tampilkangrafik1(datajson);

      // Agregasi data berdasarkan store_location, Month, dan Revenue
      const storeRevenueByMonth = datajson.reduce((acc, current) => {
        const storeLocation = current.store_location;
        const month = current.Month_Name; // Gunakan nama bulan yang lebih mudah dibaca
        const revenue = parseFloat(current.Revenue);

        if (!acc[storeLocation]) {
          acc[storeLocation] = {};
        }
        acc[storeLocation][month] = (acc[storeLocation][month] || 0) + revenue;
        return acc;
      }, {});


      // Mendapatkan daftar unik bulan
      const uniqueMonths = [...new Set(datajson.map(item => item.Month_Name))]; // Gunakan nama bulan

      // Array warna untuk setiap store
      const storeColors = {
        "Lower Manhattan": "6F798C",
        "Astoria": "#966C4D",
        "Hell\u0027s Kitchen": "#C58C58"
      };

      // Iterasi untuk membuat dataset per store
      for (const store of uniqueStores) {
        const storeData = [];
        for (const month of uniqueMonths) {
          storeData.push(storeRevenueByMonth[store][month] || 0); // Jika tidak ada revenue, set ke 0
        }

        chartData.push({
          label: store,
          data: storeData,
          backgroundColor: storeColors[store],
          borderColor: storeColors[store],
          fill: false, // Tidak mengisi area di bawah garis
        });
      }

      // Chart 4: Line Chart (Revenue for Each Store by Month)
      const ctx4 = document.getElementById("chart-4").getContext("2d");
      const myChart4 = new Chart(ctx4, {
        type: "line",
        data: {
          labels: uniqueMonths, // Label sumbu x adalah bulan
          datasets: chartData
        },
        options: {
          plugins: {
            datalabels: {
              display: false
            },
            title: {
              display: true,
              text: 'Revenue for Each Store by Month',
              position: 'top',
              font: {
                size: 16,
              },
              padding: {
                top: 20,
                bottom: 10
              }
            },
            legend: {
              display: true,
              position: 'bottom'
            },
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });



    })
    .catch(error => {
      console.error('Error fetching data:', error);
      recentOrdersContainer.innerHTML = '<p>Failed to load recent orders.</p>';
    });

});

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#recentOrdersTable tbody');

  fetch('/assets/json/data.json') // Ganti dengan path yang benar
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      populateRecentOrders(data);
    })
    .catch(error => {
      console.error('Error fetching or parsing data:', error);
      tableBody.innerHTML = '<tr><td colspan="5">Failed to load recent orders.</td></tr>';
    });
});

function populateRecentOrders(data) {
  const tableBody = document.querySelector('#recentOrdersTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  const recentOrders = data.slice(17990, 18000);

  recentOrders.forEach(order => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = order.transaction_id;
    row.insertCell().textContent = order.transaction_date;
    row.insertCell().textContent = order.store_location;
    row.insertCell().textContent = order.product_detail || order.product_name || 'Unknown Product'; // Penanganan jika field product_detail atau product_name tidak ada
    row.insertCell().textContent = `$${parseFloat(order.Revenue).toFixed(2)}`;
  });
}
