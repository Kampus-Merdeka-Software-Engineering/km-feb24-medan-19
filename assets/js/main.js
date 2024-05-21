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
              "#AF8F6F",
              "#74512D",
              "#543310",
              "#151515",
              "#F8C794",
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Transaksi per Produk Kategori',
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
          "#AF8F6F",
          "#74512D",
          "#543310",
          "#151515",
          "#F8C794",
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
                "#AF8F6F",
                "#74512D",
                "#543310",
                "#151515",
                "#F8C794",
              ],
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Transaksi per Produk Kategori',
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
