// const baseUrl = 'https://murmuring-bastion-46368.herokuapp.com/'
const baseUrl = 'https://fast-meadow-36413.herokuapp.com/'
window.onload = allClear('foods', getFoods);
window.onload = getDailyMeals();

function getDailyMeals(date) {
  var request = new XMLHttpRequest();
  var uri = 'api/v1/meals' // need to append url for a new endpoint - "current"
  request.open('GET', baseUrl + uri, true);
  request.onload = function () {
    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      populateDailyMeals(data, calculateTotalCals);
    } else {
      alert('Something went wrong');
    }
  }
  request.send();
}

function populateDailyMeals(meals_data, callback){
  meals_data.forEach(function(meal){
    populateSingleMeal(meal, `${meal.name}`);
  });
  callback(meals_data, calculateRemainingCals);
}

function populateSingleMeal(meal_data, meal_type){
  let meal_foods = meal_data.foods;
  let meal_div = getMealDiv(meal_type);
  let meal_cals = calculateMealCals(meal_foods);
  document.getElementById(`${meal_div}Cals`).innerHTML = `${meal_cals}`;
  meal_foods.forEach(function(food){
    let list_item = document.createElement("li");
    list_item.innerHTML = (`<b>${food.name}</b> ${food.calories} calories`);
    document.getElementById(`${meal_div}Foods`).appendChild(list_item);
  });
}

function calculateRemainingCals(){
  let total = document.getElementById(`calsTotal`).innerHTML;
  let result = 2000 - parseInt(`${total}`);
  document.getElementById(`calsRemaining`).innerHTML = `${result}`;
}

function calculateTotalCals(daily_meals_data, callback){
  let a = document.getElementById(`breakfastCals`).innerHTML;
  let b = document.getElementById(`lunchCals`).innerHTML;
  let c = document.getElementById(`dinnerCals`).innerHTML;
  let d = document.getElementById(`snackCals`).innerHTML;
  let result = parseInt(`${a}`) + parseInt(`${b}`) + parseInt(`${c}`) + parseInt(`${d}`);
  document.getElementById(`calsTotal`).innerHTML = `${result}`;
  callback();
}

function calculateMealCals(foods){
  let total = 0;
  foods.forEach(function(food){
    total += food.calories
  })
  return total;
}

function getMealDiv(identifier){
  if (identifier == 1 || identifier == "Breakfast"){
    return "breakfast";
  } else if (identifier == 2 || identifier == "Lunch"){
    return "lunch";
  } else if (identifier == 3 || identifier == "Snack"){
    return "snack";
  } else if (identifier == 4 || identifier == "Dinner"){
    return "dinner";
  }
}

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

function addNewFood(){
  var newName = document.getElementById("newFoodName").value;
  var newCals = document.getElementById("newFoodCals").value;
  var requestUrl = `${baseUrl}` + `api/v1/foods`;
  var data = {};
  data.name = `${newName}`;
  data.calories = `${newCals}`;
  var json = JSON.stringify(data);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", requestUrl, true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function () {
     if (xhr.readyState == 4 && xhr.status == "201") {
       window.allClear('foods', getFoods);
       hideModals();
     } else {
       hideModals();
       console.log(`Add failed`);
     }
  }
  xhr.send(json);
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

function populateFood(food_id) {
  var foodName = document.getElementById(`foodName-${food_id}`).innerHTML
  var foodCals = document.getElementById(`foodCals-${food_id}`).innerHTML
  document.getElementById("editFoodName").value = foodName;
  document.getElementById("editFoodCals").value = foodCals;
  document.getElementById("editFoodId").innerHTML = food_id;
}

function saveFood() {
  var name = document.getElementById("editFoodName").value;
  var cals = document.getElementById("editFoodCals").value;
  var currentId = document.getElementById("editFoodId").innerHTML;
  var requestUrl = `${baseUrl}` + `api/v1/foods/${currentId}`;
  var data = {};
  data.name = `${name}`;
  data.calories = `${cals}`;
  var json = JSON.stringify(data);
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", requestUrl, true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function () {
	   if (xhr.readyState == 4 && xhr.status == "202") {
       window.allClear('foods', getFoods);
       hideModals();
	   } else {
       hideModals();
       console.log(`${name} editing failed`);
	   }
  }
  xhr.send(json);
}

function allClear(div_id, callback) {
  document.getElementById(div_id).innerHTML = '';
  callback();
}

function hideModals() {
  $('.modal').modal('hide');
}
