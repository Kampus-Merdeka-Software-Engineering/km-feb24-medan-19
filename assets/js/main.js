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
  const recentOrdersContainer = document.querySelector('.recentOrders'); // Select the correct container
  fetch('assets/json/data.json')
      .then(response => response.json())
      .then(coffeeData => {
          // total revenue 

          // console.log(coffeeData)

          // fungsi reduce wajib punya 2 parameter
          // 1. fungsi proses
          // 2. nilai awal
          // 
          const totalRevenue = coffeeData.reduce((ac, current) => {
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

          const productTypeObject = coffeeData.reduce((ac, current) => {
            
            let c = ac[current.product_category] || 0;

            c+=1
            ac[current.product_category] = c;

            return ac;
          }, {});

          const ctx1 = document.getElementById("chart-1").getContext("2d");
          const myChart = new Chart(ctx1, {
            type: "pie",
            data: {
              labels: Object.keys(productTypeObject),
              datasets: [
                {
                  label: "# of Orders",
                  data: Object.values(productTypeObject),
                },
              ],
            },
            options: {
              responsive: true,
            },
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
