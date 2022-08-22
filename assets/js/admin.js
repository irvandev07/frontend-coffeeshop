const formatRupiah = (money) => {
  return new Intl.NumberFormat('id-ID',
    { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
  ).format(money);
}

const checkToken = () => {
    const token = localStorage.getItem('token_admin');
    if (token) {
      // cek valid
  
      return token;
    }
    else{
      window.location.href = '../login.html';
    }

    return;
};

document.addEventListener('DOMContentLoaded', () => {
    const token = checkToken();
    if (!token) {
      window.location.href = '../login.html';
    } else {
      getProfile(token);
    }
});

function logoutAdmin(){
    window.localStorage.removeItem('token_admin');
    window.location.reload()
}
 
const getProfile = (token) => {
  let tokens = token.split(".");
  const user = JSON.parse(atob(tokens[1]));
  document.getElementById('name').innerText = user['username'];
};

document.addEventListener('DOMContentLoaded', () =>{
  fetch('http://127.0.0.1:5000/count-table/', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'x-access-token' : checkToken('token_admin')
    }
  })
  .then(response =>{
    if(response.status == 401){window.location.href = '../login.html'}
    return response.json()
  })
  .then(json => {
      console.log(json)
      for(let i = 0; i < json.length; i++){
        document.getElementById('countPrice').innerHTML = formatRupiah(json[i].price)
        document.getElementById('countUser').innerHTML = json[i].user
        document.getElementById('countProducts').innerHTML = json[i].pro
        document.getElementById('countOrders').innerHTML = json[i].order
      }
      
  })
  .catch((error) => {
  alert('Error:'+ error);
  });
})

document.addEventListener('DOMContentLoaded', () =>{
  fetch('http://127.0.0.1:5000/sales-graph/', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'x-access-token' : checkToken('token_admin')
    }
  })
  .then(response =>{
    if(response.status == 401){window.location.href = '../login.html'}
    return response.json()
  })
  .then(json => {
      labels = [];
      values = [];
      for(let i = 0; i < json.length; i++){
        labels.push(json[i]['month']);
        values.push(json[i]['sales']);
      }
      console.log(labels, values)

      var ctx1 = document.getElementById("chart-line").getContext("2d");

      var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);

      gradientStroke1.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      gradientStroke1.addColorStop(0.2, 'rgba(0, 0, 0, 0.0)');
      gradientStroke1.addColorStop(0, 'rgba(0, 0, 0, 0)');
      new Chart(ctx1, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "Sales Graph",
            tension: 0.4,
            borderWidth: 0,
            pointRadius: 0,
            borderColor: "#000",
            backgroundColor: gradientStroke1,
            borderWidth: 3,
            fill: true,
            data: values,
            maxBarThickness: 6
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            }
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
          scales: {
            y: {
              grid: {
                drawBorder: false,
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                borderDash: [5, 5]
              },
              ticks: {
                display: true,
                padding: 10,
                color: '#fbfbfb',
                font: {
                  size: 11,
                  family: "Open Sans",
                  style: 'normal',
                  lineHeight: 2
                },
              }
            },
            x: {
              grid: {
                drawBorder: false,
                display: false,
                drawOnChartArea: false,
                drawTicks: false,
                borderDash: [5, 5]
              },
              ticks: {
                display: true,
                color: '#ccc',
                padding: 20,
                font: {
                  size: 11,
                  family: "Open Sans",
                  style: 'normal',
                  lineHeight: 2
                },
              }
            },
          },
        },
      });
      
  })
  .catch((error) => {
  alert('Error:'+ error);
  });
})

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://127.0.0.1:5000/most-orders/', {
      method: 'GET',
      credentials: 'include',
  })
  .then(response =>{
      if(response.status == 401){window.location.href = '../login.html'}
      return response.json()
  })
  .then(json => {
      // console.log(json)
      for(let i = 0; i < json.length; i++){
          document.getElementById('mostOrder').innerHTML += 
          `<tr>
                <td class="w-30">
                  <div class="d-flex px-2 py-1 align-items-center">
                    <div class="ms-1">
                      <h6 class="text-sm mb-0">${json[i].name_product}</h6>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    <h6 class="text-sm mb-0">${formatRupiah(json[i].price)}</h6>
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    <h6 class="text-sm mb-0">${json[i].total_sold}</h6>
                  </div>
                </td>
          </tr>`

          document.getElementById('carouselOrders').innerHTML +=
          `<div class="carousel-item h-100" style="background-image: url('${json[i].image}');
              background-size: cover;">
              <div class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
                <div class="icon icon-shape icon-sm bg-white text-center border-radius-md mb-3">
                  <i class="ni ni-camera-compact text-dark opacity-10"></i>
                </div>
                <h5 class="text-dark mb-1">${json[i].name_product}</h5>
                <p class="text-dark text-bold">Total sold:</p>
                <p class="text-dark">${json[i].total_sold}pcs</p>
              </div>
            </div>`
      }
  })
  .catch((error) => {
    alert('Error:'+ error);
  });
});





