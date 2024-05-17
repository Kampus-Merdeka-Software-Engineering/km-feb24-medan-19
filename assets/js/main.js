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
  // fetch('assets/json/coffeeData.json')
  //     .then(response => response.json())
  //     .then(coffeeData => {
  //         const ordersToDisplay = 5; // Jumlah pesanan terbaru yang ingin ditampilkan
  //         coffeeData.recentOrders.slice(0, ordersToDisplay).forEach(order => {
  //             const orderItem = document.createElement('div');
  //             orderItem.classList.add('recentOrder');
  //             orderItem.innerHTML = `
  //                 <div class="imgBx"><img src="assets/img/profil.jpg" alt="${order.customer}"></div>
  //                 <div class="order-info">
  //                     <div class="name">${order.customer}</div>
  //                     <div class="coffee">${order.coffee}</div>
  //                 </div>
  //                 <div class="price">$${order.price.toFixed(2)}</div>
  //                 <div class="date">${order.orderDate}</div>
  //                 <div class="status ${order.status.toLowerCase()}">${order.status}</div>`;
  //             recentOrdersContainer.appendChild(orderItem); 
  //         });
  //     })
  //     .catch(error => {
  //         console.error('Error fetching data:', error); 
  //         recentOrdersContainer.innerHTML = '<p>Failed to load recent orders.</p>'; 
  //     });
  const ff = async () => {
      const response = await fetch('assets/json/data.json');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let json = '';
      let done = false;

      while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          json += decoder.decode(value, { stream: true });
      }

      const data = JSON.parse(json);

      console.log(data)
  };

  ff();
});
