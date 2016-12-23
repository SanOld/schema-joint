    joint.shapes.defs = {}; 
    var graph = new joint.dia.Graph;
    


    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 1000,
        height: 1000,
        model: graph,
        gridSize: 1
    });
    
    joint.shapes.defs.Floors = joint.dia.Element.extend({
     markup: '',
     defaults:{
         type:'dia.Element',
         position:{ x: 200 , y: 200 },
         size:{ width: 1300, height: 200}
     }
});


    var rect = new joint.shapes.basic.Rect({
        position: { x: 100, y: 30 },
        size: { width: 100, height: 30 },
        attrs: { 
          rect: { fill: 'red' }, 
          text: { text: 'first box', fill: 'white' },
        }
    });

    var rect2 = rect.clone();
    rect2.translate(300);

    var rect3 = rect.clone();
    rect3.translate(600);
    
    rect2.attributes.attrs.text.text = 'new text';
    rect3.attributes.attrs.text.text = 'third box';

    var link = new joint.dia.Link({
        source: { id: rect.id },
        target: { id: rect2.id }
    });
    var link2 = new joint.dia.Link({
        source: { id: rect2.id },
        target: { id: rect3.id }
    });

  



    // Single port definition
    var port = {
        id: 'abc',
        group: 'a',
          args: {
                      x: 10,
                      y: 10,
                      angle: 30,
                      dx: 1,
                      dy: 1
                },
        label: {
            position: {
                name: 'bottom',
                args: {
                      x: 10,
                      y: 20,
                      angle: 30,
                      dx: 1,
                      dy: 1
                }
            },
            markup: '<text class="label-text" fill="blue"/>'
        },
        attrs: { text: { text: 'port1' } },
        markup: '<rect width="10" height="10" stroke="red"/>'
    };

    // a.) add a port in constructor.
    var rect4 = new joint.shapes.basic.Rect({
        position: { x: 50, y: 50 },
        size: { width: 90, height: 90 },
//        ports: {
//            groups: {},
//            items: [ port ]
//        }
    });

    // b.) or add a single port using API
   rect4.addPort(port);
   
  graph.addCells([rect, rect2, rect3,  link, link2]);
  graph.addCells([rect4]);
  
  
   var floor = '<g class="rotatable">'+
               '<g class="scalable">'+
                '<rect x="0" y="0" fill="transparent" width="100" stroke="#000" stroke-width="1" height="100"/>'+
               '</g>'+
             '</g>'+
             '<g><text font-family="gost" x="20" y="20" font-size="13px" text-anchor="right">Этаж2</text></g>';
           
 var floorView = new joint.shapes.defs.Floors({
     markup: floor,
     position: {x: 100, y: 200},
     size:{ width: 50, height: 50}
 });
 
 graph.addCell(floorView);