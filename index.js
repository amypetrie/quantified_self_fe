const baseUrl = 'https://murmuring-bastion-46368.herokuapp.com/'
window.onload = allClear('foods', getFoods);

function getFoods() {
  var request = new XMLHttpRequest();
  var uri = 'api/v1/foods'
  request.open('GET', baseUrl + uri, true);
  request.onload = function () {
    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      makeFoodsList(data);
    } else {
      alert('Something went wrong');
    }
  }
  request.send();
}

function deleteFood(id_in) {
  var request = new XMLHttpRequest();
  var uri = `api/v1/foods/${id_in}`
  console.log(baseUrl + uri);
  request.open('DELETE', baseUrl + uri, true);
  request.onload = function () {
    if (this.status == 204) {
      alert(`Food ${id_in} deleted!`);
      allClear('foods', getFoods);
      var data = JSON.parse(this.responseText);
    } else {
      console.log(this.status);
      alert('Something went wrong');
    }
  }
  request.send();
}

function makeFoodsList(array_in) {
  var count = 0;
  array_in.forEach(function(element) {
    var id = element.id;
    var name = element.name;
    var calories = element.calories;
    $('#foods').append(`
      <div class="col-lg-2 foodcard">
        <p><h5>${name}</h5><small class="card-text">Calories: ${calories}</small></p>
        <span><button class="delete-food" onclick="deleteFood(${id})" >Delete</span>
        <span><button class="edit-food" onclick="editFood(${id})" >Edit</span>
      </div>
      `)
  });
}

function createButtons(food_id) {
  var button = document.createElement("td");
  button.type = "button";
  button.value = "Delete";
  button.onclick = deleteFood(food_id);
  document.body.appendChild(button);
}

function editFood(food_id) {
  console.log(`${food_id} will be edited`)
}

function allClear(div_id, callback){
  document.getElementById(div_id).innerHTML = '';
  callback();
}
