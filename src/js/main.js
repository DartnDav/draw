var draw = (function() {
  //Get the height and width of the main element, we will
  //use this to size the canvas
  var main = document.querySelector("main");
  var mWidth = main.offsetWidth;
  var mHeight = main.offsetHeight;

  //Create the canvas
  var canvas = document.createElement("canvas");

  //create a drawing context
  var ctx = canvas.getContext("2d");

  //Create the initial bounding box
  var rect = canvas.getBoundingClientRect();

  //Current x,y
  var x = 0;
  var y = 0;

  //start x,y

  var x1 = 0;
  var y1 = 0;

  //end x,y
  var x2 = 0;
  var y2 = 0;

  //last x,y
  var lx = false;
  var ly = false;

  //What shape are we drawing?
  var shape = "";

  //Do we want to draw?
  var isDrawing = false;

  //stroke color
  var stroke = "";

  //fill color
  var fill = "";

  //3 point variables
  var points = [];
  var i = 0;

  return {
    //Set isDrawing
    setIsDrawing: function(bool) {
      isDrawing = bool;
    },

    //Get isDrawing
    getIsDrawing: function() {
      return isDrawing;
    },

    //Get shape
    getShape: function() {
      return shape;
    },

    //Sets the shape to be drawn
    setShape: function(shp) {
      shape = shp;
    },

    //Set a random color
    randColor: function() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },

    //A setter for stroke
    setStrokeColor: function(color) {
      stroke = color;
    },

    //A setter for fill
    setFillColor: function(color) {
      fill = color;
    },

    //A getter for stroke
    getStrokeColor: function() {
      if (stroke.length > 6) {
        return stroke;
      }

      return this.randColor();
    },

    //A getter for fill
    getFillColor: function() {
      if (fill.length > 6) {
        return fill;
      }

      return this.randColor();
    },

    //set starting x,y (mousedown)
    setStart: function() {
      x1 = x;
      y1 = y;
    },

    //set ending x,y (mouseup)
    setEnd: function() {
      x2 = x;
      y2 = y;
    },

    //Draw a three point triangle
    setPoint: function() {
      points[i] = [];
      points[i]["x"] = x;
      points[i]["y"] = y;

      if (points.length > 2) {
        this.draw();
        i = 0;
        points = [];
      } else {
        i++;
      }
    },

    //set the x,y based on event data
    setXY: function(evt) {
      //set the last x,y cords
      lx = x;
      ly = y;

      //Set the current x,y cords
      x = evt.clientX - rect.left - canvas.offsetLeft;
      y = evt.clientY - rect.top - canvas.offsetTop;
    },

    //write x,y cords back the UI
    writeXY: function() {
      document.getElementById("trackX").innerHTML = "X: " + x;
      document.getElementById("trackY").innerHTML = "Y: " + y;
    },

    //Draw a shape
    draw: function() {
      ctx.restore();
      switch (shape) {
        case "rectangle":
          this.drawRect();
          break;
        case "line":
          this.drawLine();
          break;
        case "circle":
          this.drawCircle();
          break;
        case "path":
          this.drawPath();
          break;
        case "3-point":
          this.draw3Point();
          break;
        case "triangle":
          this.drawTriangle();
          break;
        default:
          alert("Please choose a shape");
          break;
      }
      ctx.save();
    },

    //Draw a triangle
    draw3Point: function() {
      ctx.fillStyle = this.getFillColor();
      ctx.strokeStyle = this.getStrokeColor();

      ctx.beginPath();

      ctx.moveTo(points[0]["x"], points[0]["y"]);
      ctx.lineTo(points[1]["x"], points[1]["y"]);
      ctx.lineTo(points[2]["x"], points[2]["y"]);
      ctx.lineTo(points[0]["x"], points[0]["y"]);

      ctx.stroke();
      ctx.fill();
    },

    //Draw Path
    drawPath: function() {
      ctx.strokeStyle = this.getStrokeColor();
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(x, y);
      ctx.stroke();
    },

    //Draw Circle
    drawCircle: function() {
      ctx.strokeStyle = this.getStrokeColor();
      ctx.fillStyle = this.getFillColor();

      var a = x1 - x2;
      var b = y1 - y2;
      var radius = Math.sqrt(a * a + b * b);

      ctx.beginPath();
      ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    },

    //Draw Line
    drawLine: function() {
      ctx.strokeStyle = this.getStrokeColor();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },

    //Draw a triangle
    drawTriangle: function() {
      //x1,y1 to x2,y2 is the first line
      //we will use the first point +/-
      //(depending on the direction of
      //the mouse movement) the result of
      //PT to add a third point.
      var a = x1 - x2;
      var b = y1 - y2;
      var c = Math.sqrt(a * a + b * b);

      var d = x1 + c;
      var e = y1 + c;

      //Drag left to right
      if (x1 > x2) {
        d = x1 - c;
      }

      //Drag up
      if (y1 > y2) {
        e = y1 - c;
      }

      ctx.fillStyle = this.getFillColor();
      ctx.strokeStyle = this.getStrokeColor();
      ctx.beginPath();
      ctx.moveTo(x1, y1);

      ctx.lineTo(d, e);
      ctx.lineTo(x2, y2);

      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.fill();
    },

    //Draw a rectange
    drawRect: function() {
      ctx.fillStyle = this.getFillColor();
      ctx.strokeStyle = this.getStrokeColor();
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    },

    getCanvas: function() {
      return canvas;
    },

    init: function() {
      canvas.width = mWidth;
      canvas.height = mHeight;
      main.appendChild(canvas);
    }
  };
})();

draw.init();

//Draw a rectangle
document.getElementById("btnRect").addEventListener("click", function() {
  draw.setShape("rectangle");
});

//Draw a circle
document.getElementById("btnCircle").addEventListener("click", function() {
  draw.setShape("circle");
});

//Draw a path
document.getElementById("btnPath").addEventListener("click", function() {
  draw.setShape("path");
});

//Draw a triangle
document.getElementById("btnTriangle").addEventListener("click", function() {
  draw.setShape("triangle");
});

//Draw a line
document.getElementById("btnLine").addEventListener("click", function() {
  draw.setShape("line");
});

//Draw a three point triangle
document.getElementById("btn3Point").addEventListener("click", function() {
  draw.setShape("3-point");
});

//Get the starting position
draw.getCanvas().addEventListener("mousedown", function() {
  if (draw.getShape() !== "3-point") {
    draw.setStart();
    draw.setIsDrawing(true);
  }
});

//Get the ending position
draw.getCanvas().addEventListener("mouseup", function() {
  if (draw.getShape() !== "3-point") {
    draw.setEnd();
    draw.draw();
    draw.setIsDrawing(false);
  }

  if (draw.getShape() === "3-point") {
    draw.setPoint();
  }
});

//Track the x,y position
draw.getCanvas().addEventListener("mousemove", function(evt) {
  draw.setXY(evt);
  draw.writeXY();

  if (draw.getShape() === "path" && draw.getIsDrawing() === true) {
    draw.draw();
  }
});

document.getElementById("strokeColor").addEventListener("change", function() {
  draw.setStrokeColor(document.getElementById("strokeColor").value);
});

document
  .getElementById("randStrokeColor")
  .addEventListener("change", function() {
    draw.setStrokeColor("");
  });

document.getElementById("fillColor").addEventListener("change", function() {
  draw.setFillColor(document.getElementById("fillColor").value);
});

document.getElementById("randFillColor").addEventListener("change", function() {
  draw.setFillColor("");
});
