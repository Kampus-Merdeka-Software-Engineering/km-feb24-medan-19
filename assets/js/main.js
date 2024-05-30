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
      type: "pie",
      data: {
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
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Transaction by Product Category',
            position: 'bottom',
            font: {
              size: 16,
            },
            padding: {
              top: 20,
              bottom: 10
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

  fetch('assets/json/data.json')
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


      //menampilkan chart-2
      tampilkangrafik1(datajson)
      const coffeebyAzmi = datajson.reduce((ac, current) => {

        let c = ac[current.transaction_date] || 0;

        c += 1
        ac[current.transaction_date] = c;

        return ac;
      }, {});


      // Chart 2: Bar Chart
      const ctx2 = document.getElementById("chart-2").getContext("2d");
      const myChart2 = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: Object.keys(coffeebyAzmi),
          datasets: [
            {
              label: "# of Orders",
              data: Object.values(coffeebyAzmi),
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
            title: {
              display: true,
              text: 'Transaksi per Bulan',
              position: 'bottom',
              font: {
                size: 16,
              },
              padding: {
                top: 20,
                bottom: 10
              }
            }
          }
        }
      });

      // Chart-3 (Revenue for Each Store)
      tampilkangrafik1(datajson)
      const storeRevenue = datajson.reduce((ac, current) => {

        let c = ac[current.store_location] || 0;

        c += 1
        ac[current.store_location] = c;

        return ac;
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
              backgroundColor: [
                "#4B2818",
                "#966C4D",
                "#C58C58",
              ],
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Revenue for Each Store',
              position: 'bottom',
              font: {
                size: 16,
              },
              padding: {
                top: 20,
                bottom: 10
              }
            }
          }
        }
      });

      // 
      function tampilkanGrafik1(datajson) {
        const revenuePerMonth = datajson.reduce((revenues, transaction) => {
          const month = transaction.Month_Name;
          const revenue = parseFloat(transaction.Revenue);
          revenues[month] = (revenues[month] || 0) + revenue;
          return revenues;
        }, {});

        const ctx4 = document.getElementById("chart-4").getContext("2d"); // Ganti ctx4 menjadi ctx5
        const myChart4 = new Chart(ctx4, {
          type: "bar",
          data: {
            labels: Object.keys(transactionsPerCategory),
            datasets: [
              {
                label: "# of Transactions",
                data: Object.values(transactionsPerCategory),
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
              title: {
                display: true,
                text: 'Transaction by Product Category',
                position: 'bottom',
                font: {
                  size: 16,
                },
                padding: {
                  top: 20,
                  bottom: 10
                }
              }
            }
          }
        });
      }



      // console.log(Object.values(productTypeObject))

      // const ordersToDisplay = 5; // Jumlah pesanan terbaru yang ingin ditampilkan
      // coffeeData.recentOrders.slice(0, ordersToDisplay).forEach(order => {
      //     const orderItem = document.createElement('div');
      //     orderItem.classList.add('recentOrder');
      //     orderItem.innerHTML = `
      //         <div class="imgBx"><img src="assets/img/profil.jpg" alt="${order.customer}"></div>
      //         <div class="order-info">
      //             <div class="name">${order.customer}</div>
      //             <div class="coffee">${order.coffee}</div>
      //         </div>
      //         <div class="price">$${order.price.toFixed(2)}</div>
      //         <div class="date">${order.orderDate}</div>
      //         <div class="status ${order.status.toLowerCase()}">${order.status}</div>`;
      //     recentOrdersContainer.appendChild(orderItem); 
      // });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      recentOrdersContainer.innerHTML = '<p>Failed to load recent orders.</p>';
    });
});
