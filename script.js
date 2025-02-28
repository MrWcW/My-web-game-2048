// Mobile Gesture controls using Hammer.js
var myElement = document.getElementById('mobilewrap'); // Your game container element
var hammertime = new Hammer(myElement);

// Enable swipe gestures in all directions
hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

// Swipe left (move left)
hammertime.on('swipeleft', function(ev) {
  moveDirection(37); // Equivalent to pressing the left arrow key
});

// Swipe right (move right)
hammertime.on('swiperight', function(ev) {
  moveDirection(39); // Equivalent to pressing the right arrow key
});

// Swipe up (move up)
hammertime.on('swipeup', function(ev) {
  moveDirection(38); // Equivalent to pressing the up arrow key
});

// Swipe down (move down)
hammertime.on('swipedown', function(ev) {
  moveDirection(40); // Equivalent to pressing the down arrow key
});

/* ---------------------------------------------------------------------- */

// Game logic (from your original code)
var matrix = [[0, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0]];
var component = new Array();
var best = 0;
var score = 0;

// Reset the game
$(".button").on("click", function(){
  restoreField();
  init();
});

init();

// Function to reset the game state
function restoreField() {
  score = 0;
  $(".scorefield").text(score);
  matrix = [[0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]];
  component = new Array();
  $('.tiles').remove();
  $("#container").append("<div class='tiles'></div>");
  $(".over").css("visibility", "hidden").css("opacity", "0");
}

// Random number generator
function random(min, max) {
  return Math.floor((Math.random() * max) + min);
}

// Randomly pick between 2 or 4 for a new tile
function dueoquattro() {
  return (((Math.random() * 10) > 5) ? 4 : 2);
}

// Initialize the game
function init() {
  var i = 0;
  while(i < 2){
    var x = random(0, 4);
    var y = random(0, 4);

    if(matrix[x][y] == 0){
      i++;
      matrix[x][y] = dueoquattro();
      component.push({x: x, y: y});

      updateTile(12 * x, 12 * y, x, y);
    }
  }
}

// Update the position of tiles on the screen
function updateTile(trax, tray, x, y) {
  var tileValue = matrix[x][y]; 

  $(".tiles").append("<div class='tile tile-" + tileValue + " tile-" + x + "-" + y + "' style='transform: translate(" + trax + "vh, " + tray + "vh);'>" +
    "<div class='tile_content'>" +
    "<span>" + tileValue + "</span>" +
    "</div></div>");
}

// Function to handle movement
function moveDirection(code) {
  var change = 0;
  switch(code) {
    case 37: 
      component.sort(function(a, b){if(a.x < b.x){return -1;}if(a.x > b.x){return 1;}return 0;}); 
      change = move(-1, 0);
      break;
    case 38:
      component.sort(function(a, b){if(a.y < b.y){return -1;}if(a.y > b.y){return 1;}return 0;}); 
      change = move(0, -1);
      break;
    case 39:
      component.sort(function(a, b){if(a.x > b.x){return -1;}if(a.x < b.x){return 1;}return 0;}); 
      change = move(1, 0);
      break;
    case 40:
      component.sort(function(a, b){if(a.y > b.y){return -1;}if(a.y < b.y){return 1;}return 0;}); 
      change = move(0, 1);
      break;
  }

  if(change > 0){
    addTile();
  }

  if(checkDefeat()) {
    $(".over").css("visibility", "visible").css("opacity", "1");
  }
}

// Add a new tile to the board
function addTile() {
  var i = 0;
  while(i < 1) {
    var x = random(0, 4);
    var y = random(0, 4);

    if(matrix[x][y] == 0) {
      i++;
      var tileValue = dueoquattro();  // Generates a value of 2 or 4
      matrix[x][y] = tileValue;
      component.push({x: x, y: y});

      updateTile(12 * x, 12 * y, x, y);
    }
  }
}

// Move function to check if tiles can move
function move(dx, dy) {
  var change = 0;  
  for(var i = 0; i < component.length; i++) {
    while(isMovePossible(component[i].x, component[i].y, dx, dy, i)) {
      makeMove(component[i].x, component[i].y, dx, dy, i);
      change++;
      if(component[i].x != -1 && component[i].y != -1) {
        component[i].x +=  dx;
        component[i].y +=  dy;
      }
    }
  }

  checkTrash();
  return change;
}

// Make the move and update the tile positions
function makeMove(x, y, dx, dy, i) {
  var newX = x + dx;
  var newY = y + dy;  
  var newValue = matrix[x][y] + matrix[newX][newY];

  if(matrix[newX][newY] == matrix[x][y]) {
    component[i].x = -1;
    component[i].y = -1;
    score += newValue;
    $(".scorefield").text(score);
    if(score > best) {
      best = score;
      $(".numbest").text(best);
    }
  }

  matrix[newX][newY] = newValue;
  matrix[x][y] = 0;

  updateTile(12 * newX, 12 * newY, newX, newY);
  $('.tile-' + x + '-' + y + '').remove();

  if(newValue == 2048) {
    won();
  }
}

// Check for defeat condition
function checkDefeat(){
  if(component.length == 16) {
    for(var i = 0; i < component.length; i++) {
      for(var x = -1; x <= 1; x++) {
        for(var y = -1; y <= 1; y++) {
          if(x != y && Math.abs(x) != Math.abs(y)) {
            if(isMovePossible(component[i].x, component[i].y, x, y, i)) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }
}

// Function to display when the player wins
function won(){
  $(".won").css("visibility", "visible").css("padding-top", "0px").css("opacity", 1);
}

// Function to check if a move is possible
function isMovePossible(x, y, dx, dy, i) {
  var newX = x + dx;
  var newY = y + dy;

  if(newX < 4 && newX >= 0 && newY < 4 && newY >= 0) {
    if(matrix[newX][newY] == 0) {
      return true;
    } else if(matrix[newX][newY] == matrix[x][y]) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

init();
