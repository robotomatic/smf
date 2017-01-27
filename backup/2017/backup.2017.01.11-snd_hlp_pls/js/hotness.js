/********************************************************
 * See tutorial at:
 * http://www.petercollingridge.appspot.com/3D-tutorial
*********************************************************/

var backgroundColour = color(255, 255, 255);
var nodeColour = color(40, 168, 107);
var edgeColour = color(34, 68, 204);
var nodeSize = 8;

var createCuboid = function(x, y, z, w, h, d) {
    var nodes = [[x,   y,   z  ],
                 [x,   y,   z+d],
                 [x,   y+h, z  ],
                 [x,   y+h, z+d],
                 [x+w, y,   z  ],
                 [x+w, y,   z+d],
                 [x+w, y+h, z  ],
                 [x+w, y+h, z+d]];
    var edges = [[0, 1], [1, 3], [3, 2], [2, 0],
                 [4, 5], [5, 7], [7, 6], [6, 4],
                 [0, 4], [1, 5], [2, 6], [3, 7]];
    return { 'nodes': nodes, 'edges': edges };
};
    
var object1 = createCuboid(-120, -20, -20, 240, 40, 40);
var object2 = createCuboid(-120, -50, -30, -20, 100, 60);
var object3 = createCuboid( 120, -50, -30,  20, 100, 60);
var objects = [object1, object2, object3];

// Rotate shape around the z-axis
var rotateZ3D = function(theta, nodes) {
    var sin_t = sin(theta);
    var cos_t = cos(theta);
    
    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var y = node[1];
        node[0] = x * cos_t - y * sin_t;
        node[1] = y * cos_t + x * sin_t;
    }
};

var rotateY3D = function(theta, nodes) {
    var sin_t = sin(theta);
    var cos_t = cos(theta);
    
    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cos_t - z * sin_t;
        node[2] = z * cos_t + x * sin_t;
    }
};

var rotateX3D = function(theta, nodes) {
    var sin_t = sin(theta);
    var cos_t = cos(theta);
    
    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cos_t - z * sin_t;
        node[2] = z * cos_t + y * sin_t;
    }
};

//rotateZ3D(30);
//rotateY3D(30);
//rotateX3D(30);

var draw= function() {
    background(backgroundColour);
    var nodes, edges;
    
    // Draw edges
    stroke(edgeColour);
    
    for (var obj = 0; obj < objects.length; obj++) {
        nodes = objects[obj].nodes;
        edges = objects[obj].edges;

        for (var e = 0; e < edges.length; e++) {
            var n0 = edges[e][0];
            var n1 = edges[e][1];
            var node0 = nodes[n0];
            var node1 = nodes[n1];
            line(node0[0], node0[1], node1[0], node1[1]);
        }   
    }

    // Draw nodes
    fill(nodeColour);
    noStroke();
    for (var obj = 0; obj < objects.length; obj++) {
        nodes = objects[obj].nodes;

        for (var n = 0; n < nodes.length; n++) {
            var node = nodes[n];
            ellipse(node[0], node[1], nodeSize, nodeSize);
        }
    }

};

var mouseDragged = function() {
    var dx = mouseX - pmouseX;
    var dy = mouseY - pmouseY;
    
    for (var obj = 0; obj < objects.length; obj++) {
        var nodes = objects[obj].nodes;
        rotateY3D(dx, nodes);
        rotateX3D(dy, nodes);
    }
};

translate(200, 200);
