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
  fetch('http://127.0.0.1:5000/categories/', {
    method: 'GET',
    credentials: 'include',
    headers: 
      {
        'x-access-token' : checkToken('token_admin')
      }
  })
  .then(response =>{
    if(response.status == 401){window.location.href = '../login.html'}
    return response.json()
  })
  .then(json => {
    // console.log(json)
      const table = $('#categories').DataTable({
        "autoWidth": false,
        data: json,
        columns: [
          { data: 'id' },
          { data: 'name_categories' },
        ]
      })

      $('#categories tbody').on('click', 'tr', function () {
        let data = table.row(this).data();
        $('#modalCategories').modal('show');
        document.getElementById('categories-id').value = data['id']
        document.getElementById('categories-name').value = data['name_categories']
        document.getElementById('btn-delete').setAttribute('onclick','deleteThis("'+data['id']+'")')
        document.getElementById('btn-update').setAttribute('onclick','updateThis("'+data['id']+'","'+data['name_categories']+'")')
      });
  })
  .catch((error) => {
    alert('Error:'+ error);
  });
})

function addCategories(){
  const addCategories = document.getElementById('addCategories');
  const data = new FormData(addCategories);
  const name = data.get('name');
  if ((name == "")){
      alert("Please insert data")
  } else{
    const addCat = { 
        name_categories: name
    };
    const url = "http://127.0.0.1:5000/categories/";
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token' : checkToken('token_admin')
        },
        body: JSON.stringify(addCat)
    })
    .then(response =>  response.json())
    .then(data => {
        alert('Successfully create categories', data);
        // window.location.reload()
    })
    .catch((error) => {
        alert('Error:', error);
    });
  }
}

function deleteThis(id){
  // console.log(e.target.getAttribute('data-id'))
  fetch('http://127.0.0.1:5000/categories/'+id+'/', {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'x-access-token' : checkToken('token_admin')
    },
  })
  .then(response => response.json())
  .then(data => {
    swal({
      title: "Good job!",
      text: "You clicked the button!",
      icon: "success",
      button: window.location.reload(data),
    });
  })
}

function updateThis(id, name){
  const name_categories = document.getElementById('categories-name')
  name = name_categories.value;
  const update = { 
    name_categories: name,
  };
  // console.log(update)
  fetch('http://127.0.0.1:5000/categories/'+id+'/', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token' : checkToken('token_admin')
      },
      body: JSON.stringify(update)
  })
  .then(response => response.json())
  .then(data => {
    alert('Successfully update', data);
    window.location.reload()
  })
  .catch((error) => {
    alert('Error:', error);
  });
}

