const baseUrl = 'https://murmuring-bastion-46368.herokuapp.com/'
window.onload = getFoods();

function getFoods() {
  var request = new XMLHttpRequest();
  var uri = 'api/v1/foods'
  request.open('GET', baseUrl + uri, true);
  request.onload = function () {
    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      console.log(data);
      makeFoodsList(data);
    } else {
      alert('Something went wrong');
    }
  }
  request.send();
}

function makeFoodsList(array_in) {
  console.log(array_in)
  var count = 0;
  array_in.forEach(function(element) {
    var id = element.id;
    var name = element.name;
    var calories = element.calories;
    $('#foods').append(`
      <div class="card">
      <h4>${name}</h4>
      <span>${calories}</span>
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

function deleteFood(food_id) {
  console.log(`${food_id} will be deleted`)
}

function editFood(food_id) {
  console.log(`${food_id} will be edited`)
}

function aClear(){
  document.getElementById('newLocation').value = '';
}
