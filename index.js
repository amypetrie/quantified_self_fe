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
      <div class="col-lg-2 foodcard-${id}">
        <p><h5 id="foodName-${id}">${name}</h5><small class="card-text">Calories: <div id="foodCals-${id}">${calories}</div></small></p>
        <span><button class="delete-food" onclick="deleteFood(${id})">Delete</span>
        <span><button class="edit-food" id="editFoodButton" data-toggle="modal" data-target="#modal1" onclick="populateFood(${id})">Edit</span>
      </div>
      `)
  });
}

function populateFood(food_id){
  var foodName = document.getElementById(`foodName-${food_id}`).innerHTML
  var foodCals = document.getElementById(`foodCals-${food_id}`).innerHTML
  document.getElementById("editFoodName").value = foodName;
  document.getElementById("editFoodCals").value = foodCals;
  document.getElementById("editFoodId").innerHTML = food_id;
}

// function saveFood(){
//   var name = document.getElementById("editFoodName").value;
//   var cals = document.getElementById("editFoodCals").value;
//   var currentId = document.getElementById("editFoodId").innerHTML;
//   var request = new XMLHttpRequest();
//   var uri = `api/v1/foods/${currentId}`
//   console.log(baseUrl + uri);
//   request.open('PATCH', baseUrl + uri, true);
//   request.onload =  function () {
//     if (this.status == 202) {
//       alert(`Food ${currentId} edited!`);
//       allClear('foods', getFoods);
//     } else {
//       console.log(this.status);
//       alert('Something went wrong');
//     }
//   }
//   request.send({"name": `${name}`, "calories": `${cals}`});
// }

function saveFood(){
    var name = document.getElementById("editFoodName").value;
    var cals = document.getElementById("editFoodCals").value;
    var currentId = document.getElementById("editFoodId").innerHTML;
    var requestUrl = `${baseUrl}` + `api/v1/foods/${currentId}`;
    console.log(requestUrl);
    const requestResponse = $.ajax(
                                  {url: `${requestUrl}`,
                                  type: 'patch',
                                  contentType: 'application/json',
                                  data: {name: `${name}`, calories: `${cals}`},
                                  dataType: 'json',
                                  success: function(res){
                                    console.log("Success!");
                                  },
                                  error: function(res){
                                    console.log("Error!");
                                  }
                                });
}

function allClear(div_id, callback){
  document.getElementById(div_id).innerHTML = '';
  callback();
}
