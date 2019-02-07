// const baseUrl = 'https://murmuring-bastion-46368.herokuapp.com/'
const baseUrl = 'https://fast-meadow-36413.herokuapp.com/'
var allFoods = null;
window.onload = allClear('foods', getFoods);
window.onload = getDailyMeals();
window.onload = getAllMeals();

function getDailyMeals() {
  var request = new XMLHttpRequest();
  var uri = 'api/v1/meals'
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

function getAllMeals() {
  var request = new XMLHttpRequest();
  var uri = 'api/v1/meals'
  request.open('GET', 'https://murmuring-bastion-46368.herokuapp.com/' + uri, true);
  request.onload = function () {
    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      populateAllMeals(data);
    } else {
      alert('Something went wrong');
    }
  }
  request.send();
}

function populateAllMeals(meals_data){
  meals_data.forEach(function(meal){
    populateMeal(meal);
  });
}

function populateMeal(meal_data, callback){

  var meal_id = meal_data.id;
  var date = meal_data.date;
  // let date_time = timeConverter(date);
  let meal_date = new Date(date).toDateString();
  var meal_foods = meal_data.foods;
  var meal_type = getMealDivName(meal_data.name);

  let single_meal_div = document.createElement("div");
  let date_header = document.createElement("h4");
  let name_header = document.createElement("h5");
  let food_list = document.createElement("ul");
  date_header.innerHTML = `${meal_date}`;
  name_header.innerHTML = `${meal_type}`;

  meal_foods.forEach(function(food){
    let food_item = document.createElement("li");
    food_item.innerHTML = `${food.name}: ${food.calories} calories`
    food_list.appendChild(food_item);
  });

  single_meal_div.append(date_header);
  single_meal_div.append(name_header);
  single_meal_div.append(food_list);

  document.getElementById("historyBody").append(single_meal_div);
}

function populateDailyMeals(meals_data, callback){
  document.getElementById('breakfast-buttons').innerHTML = '';
  document.getElementById('lunch-buttons').innerHTML = '';
  document.getElementById('snack-buttons').innerHTML = '';
  document.getElementById('dinner-buttons').innerHTML = '';
  meals_data.forEach(function(meal){
    var meal_string = String(meal.name);
    populateSingleMeal(meal, meal_string);
  });
  callback(meals_data, calculateRemainingCals);
}

function populateSingleMeal(meal_data, meal_type){
  var meal_id = meal_data.id;
  var meal_foods = meal_data.foods;
  var meal_string = getMealDivName(meal_type);
  var meal_identifier = getMealType(meal_string);
  var meal_cals = calculateMealCals(meal_foods);
  document.getElementById(`${meal_string}Cals`).innerHTML = `${meal_cals}`;
  meal_foods.forEach(function(food){
    let list_item = document.createElement("li");
    let specific_food_id = document.createElement("p");
    specific_food_id.innerHTML = `${food.id}`;
    list_item.innerHTML = (`${food.name}, ${food.calories} calories ID:`);
    list_item.append(specific_food_id.innerHTML);
    document.getElementById(`${meal_string}Foods`).appendChild(list_item);
  });
  $(`#${meal_string}-buttons`).append(`
    <hr>
    <button type="button" class="btn btn-primary btn-sm meal-edit" role="button" onClick="createAllChoices(${meal_id})" id="newFoodButton" data-toggle="modal" data-target="#modal3">Add Food</button></span>
    <hr>
    <button type="button" class="btn btn-primary btn-sm meal-edit" role="button" onClick="createExistingChoices(${meal_identifier})" id="removeFoodButton" data-toggle="modal" data-target="#modal4">Remove Food</button></span>
  `);
}

function createExistingChoices(meal_identifier){
  let meal_type = getMealDivName(meal_identifier);
  let curr = document.getElementById(`${meal_type}Foods`).children;
  for (i = 0; i < curr.length; i++) {
    var specific_food = document.createElement("li");
    var specific_food_id = document.createElement("p");
    specific_food.append(curr[i].innerHTML);
    var existingSelection = document.createElement("input");
    existingSelection.setAttribute("type", "checkbox");
    specific_food.append(existingSelection);

    document.getElementById('currentFoods').appendChild(specific_food);
  }
}

function createAllChoices(meal_id){
  allFoods.forEach(function(food_item) {
    var specific_food = document.createElement("li");
    var specific_food_id = document.createElement("p");
    specific_food.append(`${food_item.name}, ${food_item.calories} calories `);
    specific_food_id.append(`${food_item.id}`);
    var choiceSelection = document.createElement("input");
    choiceSelection.setAttribute("type", "checkbox");
    specific_food.append(choiceSelection);
    specific_food.append(specific_food_id);

    document.getElementById('availableFoods').appendChild(specific_food);
    document.getElementById('mealIdentifier').innerHTML = `${meal_id}`;
  });
}

function updateMeal(){
  var requestUrl = `${baseUrl}` + `api/v1/foods`;
  var avail_foods = document.getElementById("availableFoods");
  var meal_id = document.getElementById("mealIdentifier").innerHTML;
  var checkmarks = avail_foods.getElementsByTagName("input");
  var list_items = avail_foods.getElementsByTagName("li");
  var data = {};

  for (var i = 0, len = list_items.length; i < len; i++ ) {
    if (checkmarks[ i ].checked){
      var food_id = list_items[i].getElementsByTagName("p")[0].innerHTML;
      postFoodtoMeal(food_id, meal_id);
      hideModals();
      document.getElementById('availableFoods').innerHTML = '';
    };
  }
}

function removeMealFood(){
  var requestUrl = `${baseUrl}` + `api/v1/foods`;
  var avail_foods = document.getElementById("availableFoods");
  var meal_id = document.getElementById("mealIdentifier").innerHTML;
  var checkmarks = avail_foods.getElementsByTagName("input");
  var list_items = avail_foods.getElementsByTagName("li");
  var data = {};

  for (var i = 0, len = list_items.length; i < len; i++ ) {
    if (checkmarks[ i ].checked){
      var food_id = list_items[i].getElementsByTagName("p")[0].innerHTML;
      postFoodtoMeal(food_id, meal_id);
      hideModals();
      document.getElementById('currentFoods').innerHTML = '';
    };
  }
}

function clearModal(){
  hideModals();
  document.getElementById('currentFoods').innerHTML = '';
  document.getElementById('availableFoods').innerHTML = '';
}

function postFoodtoMeal(food_id, meal_id){
  var uri = `https://fast-meadow-36413.herokuapp.com/api/v1/meals/${meal_id}/foods/${food_id}`;
  var data = {};
  data.meal_id = meal_id;
  data.food_id = food_id;
  var json = JSON.stringify(data);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", uri, true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function () {
     if (xhr.readyState == 4 && xhr.status == "201") {
       console.log("Food added to meal");
       document.getElementById("")
       getDailyMeals();
     } else {
       console.log(`Something went wrong`);
       hideModals();
     }
  }
  xhr.send(json);
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
  var total = 0;
  foods.forEach(function(food){
    total += food.calories
  })
  return total;
}

function getMealDivName(identifier){
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

function getMealType(identifier){
  if (identifier == "breakfast" || identifier == "Breakfast"){
    return 1;
  } else if (identifier == "lunch" || identifier == "Lunch"){
    return 2;
  } else if (identifier == "snack" || identifier == "Snack"){
    return 3;
  } else if (identifier == "dinner" || identifier == "Dinner"){
    return 4;
  }
}

function getFoods() {
  var request = new XMLHttpRequest();
  var uri = 'api/v1/foods'
  request.open('GET', baseUrl + uri, true);
  request.onload = function () {
    if (this.status == 200) {
      var foods_returned = JSON.parse(this.responseText);
      allFoods = foods_returned;
      makeFoodsList(allFoods);
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
  var top_data = {};
  var data = {};
  data.name = `${newName}`;
  data.calories = `${newCals}`;
  top_data.food = data;
  var json = JSON.stringify(top_data);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", requestUrl, true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function () {
     if (xhr.readyState == 4 && xhr.status == "200") {
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
  var uri = `api/v1/foods/${id_in}`;
  request.open('DELETE', baseUrl + uri, true);
  request.onload = function () {
    if (this.status == 204) {
      alert(`Food ${id_in} deleted!`);
      allClear('foods', getFoods);
    } else {
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
  var top_data = {}
  var data = {};
  data.name = `${name}`;
  data.calories = `${cals}`;
  top_data.food = data;
  var json = JSON.stringify(top_data);
  var xhr = new XMLHttpRequest();
  xhr.open("PATCH", requestUrl, true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function () {
	   if (xhr.readyState == 4 && xhr.status == "201") {
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
