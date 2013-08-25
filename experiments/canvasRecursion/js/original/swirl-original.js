// Canvas and context
var context;
var width = window.innerWidth; // width and height of canvas
var height = window.innerHeight;

// Setup parameters
var tree = [];
var direction_offset = 0;
var trunk_height = 1.6;

//Branch parameters
var branch;
var branch_shrink = 0.95; // factor by which branches shrink every frame
var start_width = 10; // starting width of each branch
var end_width = 0.5; // minimum width for branch, after which they are discontinued
var straighten_factor = 0.91; // value from 0 to 1, factor applied to direction_offset every frame
var curviness = 0.2; // amount of random direction change each frame
var branch_count = 8; // branch count per tree
var branch_bud_size = 0.55; // ratio of original branch size at which branch will split

// apply initial settings to canvas object
function init() {
    var canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext("2d");
    context.fillStyle = "rgba(0, 0, 0, 0.0)";
    context.fillRect(0, 0, width, height);
    context.lineCap = "square";
    context.lineJoin = "round";
    context.strokeStyle = "rgba(0, 0, 0, 0.7)";
    canvas.onclick = context_click;
    setInterval(draw_frame, 20);
}

//Branch Constuctor
function Branch(position, direction, width) {
    this.draw = true;
    this.x = position.x;
    this.y = position.y;
    this.width = width;
    this.original_width = width;
    this.direction = direction;
    this.newXPos = 0;
    this.newYPos = 0;
}

Branch.prototype.update = function(){

    this.width *= branch_shrink;
    this.direction += direction_offset;

    if (this.width >= start_width/trunk_height ) {
        context.strokeStyle = "rgba(69, 44, 29, 0.8)";
        context.beginPath();
        context.lineWidth = this.width;
        this.newYPos = this.y -(Math.random() * 35);
        this.newXPos = this.x;
        context.quadraticCurveTo(this.x, this.y, this.newXPos, this.newYPos);
        context.stroke();
        this.y = this.newYPos;
        this.x = this.newXPos;
    } else {

        context.strokeStyle = "rgba(44, 63, 12, 0.7)";
        this.newXPos = this.x + (Math.cos(this.direction) * this.width);
        this.newYPos = this.y + (Math.sin(this.direction) * this.width);

        context.beginPath();
        context.lineWidth = this.width;
        context.quadraticCurveTo(this.x, this.y, this.newXPos, this.newYPos);
        context.stroke();

        this.x = this.newXPos;
        this.y = this.newYPos;

    }

    if (this.width < (this.original_width * branch_bud_size)) {
        this.original_width *= branch_bud_size;
       	tree.push(new Branch(this, this.direction + 1, this.original_width));
    }
    context.closePath();
};

// create tree at the specified position with number of tree
function create_tree(position) {
    var angle_offset = Math.PI * 2 / branch_count;

    for (var i = 0; i < branch_count; i++) {
        tree.push(new Branch(position, angle_offset * i, start_width));
    }
}

function draw_frame() {
    direction_offset += Math.random() * curviness - curviness / 2;
    direction_offset *= straighten_factor;

    for (var i = 0; i < tree.length; i++){
    	branch = tree[i];
    	if (branch.draw) branch.update();
        if (branch.width < end_width) branch.draw = false;
    }
}

// On mouse click, create two trees in one spot
function context_click(event) {
    create_tree({
        //position
        x: event.pageX - context.canvas.offsetLeft,
        y: event.pageY - context.canvas.offsetTop
    });
}