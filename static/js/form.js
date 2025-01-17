var x, y, scale, state,  // Variables we'll use later.
    canvas = document.getElementById("canvas"), // Get the canvas,
    ctx = canvas.getContext("2d"),             // And it's context.
    counter = 0,          // Counter to increment for the sin / cos functions.
    orbit = {             // Settings for the orbiting planet:
      width: 400,         //   Orbit width (increased to make it orbit outside the form),
      height: 200,        //   Orbit height (increased for more visible orbit)
      size: 15            //   Orbiting planet's size.
    };

function setCanvasSize() {
    // Get the form position relative to the viewport
    var form = document.getElementById("form");
    var rect = form.getBoundingClientRect();
    
    // Set canvas size to match the space around the form for the orbit
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    return rect;
}

function update() {
    // Get the form position relative to the viewport
    var rect = setCanvasSize();
    
    // Set the center of the orbit to be slightly outside the form's center
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
  
    // Adjust the orbit so the planet stays outside the form
    state = counter / 75; // Decrease the speed of the planet for a nice smooth animation.
    x = centerX + Math.sin(state) * orbit.width;  // Orbiting planet x position.
    y = centerY + Math.cos(state) * orbit.height; // Orbiting planet y position.
    scale = (Math.cos(state) + 2) * orbit.size;  // Orbiting planet size.
  
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  
    // Draw the orbiting red planet around the form
    drawPlanet("#d5d7ec ", x, y, scale); // Draw the orbiting planet.
  
    counter++;
}

function drawPlanet(color, x, y, size) {
    ctx.fillStyle = color || "#000";
    ctx.beginPath();
    ctx.arc(x || canvas.width / 2,
            y || canvas.height / 2,
            size || 50,
            0,
            Math.PI * 2);
    ctx.fill();
}

// Execute `update` every 10 ms.
setInterval(update, 10);




// // This is bad
// var x, y, scale, state,  // Variables we'll use later.
//     canvas = document.getElementById("canvas"), // Get the canvas,
//     ctx = canvas.getContext("2d"),             // And it's context.
//     counter = 0,          // Counter to increment for the sin / cos functions.
//     width = 600,          // Canvas width.
//     height = 500,         // Canvas height.
//     centerX = width / 2,  // X-axis center position.
//     centerY = height / 2, // Y-axis center position.
//     orbit = {             // Settings for the orbiting planet:
//       width: 500,         //   Orbit width,
//       height: 300,         //   Orbit height,
//       size: 20            //   Orbiting planet's size.
//     };

// canvas.width = width;   // Set the width and height of the canvas.
// canvas.height = height;

// // function setCanvasSize() {
// //     // Get the form position relative to the viewport
// //     var form = document.getElementById("form");
// //     var rect = form.getBoundingClientRect();
    
// //     // Set canvas size to match the space around the form for the orbit
// //     canvas.width = window.innerWidth;
// //     canvas.height = window.innerHeight;
    
// //     return rect;
// // }

// function update() {
//     // Get the form position relative to the viewport
//     var form = document.getElementById("form");
//     var rect = form.getBoundingClientRect();
    
//     // Set the center of the orbit to the center of the form
//     var centerX = rect.left + rect.width / 2;
//     var centerY = rect.top + rect.height / 2;
  
//     state = counter / 75; // Decrease the speed of the planet for a nice smooth animation.
//     x = centerX + Math.sin(state) * orbit.width;  // Orbiting planet x position.
//     y = centerY + Math.cos(state) * orbit.height; // Orbiting planet y position.
//     scale = (Math.cos(state) + 2) * orbit.size;  // Orbiting planet size.
  
//     ctx.clearRect(0, 0, width, height); // Clear the canvas
  
//     // Draw the orbiting red planet around the form
//     drawPlanet("#f00", x, y, scale); // Draw the orbiting planet.
  
//     counter++;
//   }

//   function drawPlanet(color, x, y, size) {
//     ctx.fillStyle = color || "#000";
//     ctx.beginPath();
//     ctx.arc(x || width / 2,
//             y || height / 2,
//             size || 50,
//             0,
//             Math.PI * 2);
//     ctx.fill();
//   }
  
//   // Execute `update` every 10 ms.
//   setInterval(update, 10);




// function update(){
//   state = counter / 75; // Decrease the speed of the planet for a nice smooth animation.
//   x = centerX + Math.sin(state) * orbit.width;  // Orbiting planet x position.
//   y = centerY + Math.cos(state) * orbit.height; // Orbiting planet y position.
//   scale = (Math.cos(state) + 2) * orbit.size;  // Orbiting planet size.

//   ctx.clearRect(0, 0, width, height); // Clear the canvas

//   // If the orbiting planet is before the center one, draw the center one first.
//   (y > centerY) && drawPlanet();
//   drawPlanet("#f00", x, y, scale); // Draw the orbiting planet.
//   (y <= centerY) && drawPlanet();

//   counter++;
// }

// Draw a planet. Without parameters, this will draw a black planet at the center.
// function drawPlanet(color, x, y, size){
//   ctx.fillStyle = color || "#000";
//   ctx.beginPath();
//   ctx.arc(x || centerX,
//           y || centerY,
//           size || 50,
//           0,
//           Math.PI * 2);
//   ctx.fill();
// }

// Execute `update` every 10 ms.
// setInterval(update, 10);