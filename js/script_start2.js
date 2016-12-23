    joint.shapes.defs = {}; 
    
    var graph = new joint.dia.Graph;
    

    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 1000,
        height: 1000,
        model: graph,
        gridSize: 1
    });



joint.shapes.defs.NewEl = joint.dia.Element.extend({
      markup: '',
      defaults:{
          type:'dia.Element',
          position:{ x: 10 , y: 10 },
          size:{ width: 100, height: 100},
      }
 });
     
var NewEl = function(x, y, width, height, markup, text, text_location, text_angle, text_color) {
  
  text_angle = text_angle || 0;
  text_color = text_color || "#000";
  text = text || '';
  text_location = text_location || 'top';
  
  
    var cell = new joint.shapes.defs.NewEl({
          markup: markup,
           position:{ x: x , y: y },
           size:{ width: width, height: height},
           attrs:{
             text:{
               text:'www',
               transform: "rotate(90 0,0)"
             }
           }
     });


  var text_x = 10;
  var text_y = 10;
  switch (text_location) {
    case 'top':
      text_x = width/2;
      text_y = -10;
      break;
    case 'left':
      text_x = -10;
      text_y = 0;    
      break;  
  } 
  
    var port = {
        id: 'abc',
        group: 'a',
        args: {x: 0,y: 0,angle: 0,dx: 0,dy: 0},
        label: {
            position: {
                name: text_location,
                args: {
                      x: text_x,
                      y: text_y,
                      angle: text_angle,
                      dx: 1,
                      dy: 1
                }
            },
            markup: '<text class="label-text" fill="blue"/>'
        },
        attrs: { text: { text: text } },
        markup: '<rect width="0" height="0" stroke="red"/>'
    };
    
    
    cell.addPort(port);
//    graph.addCell(cell);
    return cell;
};
  
  
 var IOEAO = [
          
          '<g>'
          ,'<g>'
          ,  '<text class="label-text" fill="blue"/>'
          ,'</g>'
            ,'<rect fill="none" width="100" height="100"/>'
            ,'<rect x="5" y="5" fill="none" width="90" height="90"/>'
            ,'<path fill="none" stroke="#000000" stroke-miterlimit="10" d="M68.5,97.34"/>'
            ,'<path fill="none" stroke="#000000" stroke-miterlimit="10" d="M68.5,7.339"/>'
            ,'<g>'
            ,  '<g>'
            ,    '<rect x="3.443" y="18.25" stroke="#000000" stroke-miterlimit="10" width="62.672" height="63.5"/>'
            ,    '<path fill="#FFFFFF" stroke="#000000" stroke-miterlimit="10" d="M66.115,81.75c-17.306,0-31.336-14.215-31.336-31.75'
            ,      'c0-17.536,14.03-31.75,31.336-31.75V81.75z"/>'
            ,  '</g>'
            ,  '<polygon points="95.343,49.106 78.792,53.604 78.792,49.618 78.792,45.2 		"/>'
            ,  '<line stroke="#000000" stroke-miterlimit="10" x1="66.115" y1="49.402" x2="78.792" y2="49.402"/>'
            ,'</g>'
          ,'</g>'].join('');
          
 var IOEPL = [

            '<g>'
              ,'<rect fill="none" width="100" height="100"/>'
              ,'<rect x="5" y="5" fill="#FFFFFF" stroke="#000000" stroke-miterlimit="10" width="90" height="90"/>'
              ,'<line fill="none" stroke="#000000" stroke-miterlimit="10" x1="95" y1="5" x2="50" y2="50"/>'
              ,'<line fill="none" stroke="#000000" stroke-miterlimit="10" x1="95" y1="95" x2="50" y2="50"/>'
          ,'</g>'].join('');
  var IPUFP = [

            '<g>'
            ,  '<g>'
            ,   '<rect x="20.399" y="20.655" fill="#FFFFFF" width="61.048" height="61.048"/>'
            ,    '<g>'
            ,        '<rect x="20.399" y="20.655" fill="#FFFFFF" stroke="#C85149" stroke-width="2" stroke-miterlimit="10" width="61.048" height="61.048"/>'
            ,      '<line fill="none" stroke="#C85149" stroke-width="0.75" stroke-miterlimit="10" x1="38.654" y1="44.8" x2="61.695" y2="28.097"/>'
            ,      '<line fill="none" stroke="#C85149" stroke-width="0.75" stroke-miterlimit="10" x1="61.695" y1="59.38" x2="38.654" y2="44.8"/>'
            ,        '<line fill="none" stroke="#C85149" stroke-width="0.75" stroke-miterlimit="10" x1="35.961" y1="77.301" x2="61.695" y2="59.38"/>'
            ,    '</g>'
            ,  '</g>'
            ,  '<circle fill="none" stroke="#C85149" stroke-miterlimit="10" cx="51.056" cy="51.312" r="44.592"/>'
        ,'</g>'].join('');   
  var PPKP = [

          '<g>'
           , '<rect y="22.5" fill="#FFFFFF" stroke="#D24A43" stroke-width="6" stroke-miterlimit="10" width="100" height="55"/>'
           , '<rect x="50" y="50" fill="#D24A44" stroke="#B24F46" stroke-miterlimit="10" width="50" height="27.5"/>'
        ,'</g>'].join('');     
 
 //Извещатель оптико-электронный активный одноблочный   
 var IOEAO_View = new joint.shapes.defs.NewEl({
     markup: IOEAO,
     position: {x: 100, y: 200},
     size:{ width: 100, height: 100}
 });
 //Извещатель оптико-электронный пассивный линейный
  var IOEPL_View = new joint.shapes.defs.NewEl({
     markup: IOEPL,
     position: {x: 250, y: 200},
     size:{ width: 100, height: 100}
 });
 //Извещатель пожарный для установки за фальш потолком
 var IPUFP_View = new joint.shapes.defs.NewEl({
     markup: IPUFP,
     position: {x: 400, y: 200},
     size:{ width: 100, height: 100}
 });
 //Прилад приймально-контрольний (ППКП)2AI
 var PPKP_View = new joint.shapes.defs.NewEl({
     markup: PPKP,
     position: {x: 550, y: 200},
     size:{ width: 100, height: 100}
 });
 
     var link = new joint.dia.Link({
        source: { id: IOEAO_View.id },
        target: { id: IOEPL_View.id }
    });
    var link2 = new joint.dia.Link({
        source: { id: IOEPL_View.id },
        target: { id: IPUFP_View.id }
    });
    var link3 = new joint.dia.Link({
        source: { id: IPUFP_View.id },
        target: { id: PPKP_View.id }
    })
 
 graph.addCells([IOEAO_View, IOEPL_View, IPUFP_View, PPKP_View, link, link2, link3]);
 
 
 //вариант2
var IOEAO_View2 = NewEl(100,100,100,100,IOEAO, 'одноблочный','left',270);
var IOEPL_View2 = NewEl(250,100,100,100,IOEPL, 'линейный','top',0);
var IPUFP_View2 = NewEl(400,100,100,100,IPUFP, 'за потолком','top',0);
var PPKP_View2 = NewEl(550,100,100,100,PPKP, 'контрольный','top',0);



graph.addCells([IOEAO_View2, IOEPL_View2, IPUFP_View2, PPKP_View2]);