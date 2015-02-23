var context,width=window.innerWidth,height=window.innerHeight,tree=[],direction_offset=0,trunk_height=1.6,branch,branch_shrink=0.95,start_width=10,end_width=0.5,straighten_factor=0.91,curviness=0.2,branch_count=8,branch_bud_size=0.55;
function init(){var a=document.getElementById("canvas");a.width=width;a.height=height;context=a.getContext("2d");context.fillStyle="rgba(0, 0, 0, 0.0)";context.fillRect(0,0,width,height);context.lineCap="square";context.lineJoin="round";context.strokeStyle="rgba(0, 0, 0, 0.7)";a.onclick=context_click;setInterval(draw_frame,20)}function Branch(a,c,b){this.draw=!0;this.x=a.x;this.y=a.y;this.original_width=this.width=b;this.direction=c;this.newYPos=this.newXPos=0}
Branch.prototype.update=function(){this.width*=branch_shrink;this.direction+=direction_offset;this.width>=start_width/trunk_height?(context.strokeStyle="rgba(69, 44, 29, 0.8)",context.beginPath(),context.lineWidth=this.width,this.newYPos=this.y-35*Math.random(),this.newXPos=this.x,context.quadraticCurveTo(this.x,this.y,this.newXPos,this.newYPos),context.stroke(),this.y=this.newYPos,this.x=this.newXPos):(context.strokeStyle="rgba(44, 63, 12, 0.7)",this.newXPos=this.x+Math.cos(this.direction)*this.width,
this.newYPos=this.y+Math.sin(this.direction)*this.width,context.beginPath(),context.lineWidth=this.width,context.quadraticCurveTo(this.x,this.y,this.newXPos,this.newYPos),context.stroke(),this.x=this.newXPos,this.y=this.newYPos);this.width<this.original_width*branch_bud_size&&(this.original_width*=branch_bud_size,tree.push(new Branch(this,this.direction+1,this.original_width)));context.closePath()};
function create_tree(a){for(var c=2*Math.PI/branch_count,b=0;b<branch_count;b++)tree.push(new Branch(a,c*b,start_width))}function draw_frame(){direction_offset+=Math.random()*curviness-curviness/2;direction_offset*=straighten_factor;for(var a=0;a<tree.length;a++)branch=tree[a],branch.draw&&branch.update(),branch.width<end_width&&(branch.draw=!1)}function context_click(a){create_tree({x:a.pageX-context.canvas.offsetLeft,y:a.pageY-context.canvas.offsetTop})};