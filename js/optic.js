var paperWidth = 1300;  //ширина холста
var paperHeight = 3000; //высота холста
var minX = x;           //граница отрисовки
var minY = y;           //граница отрисовки
var maxX = paperWidth;  //граница отрисовки
var maxY = paperHeight; //граница отрисовки

var y = 100;            //начальное положение первого элемента по x
var x = 100;            //начальное положение первого элемента по н
var yStep = 150;         //шаг отрисовки по x
var xStep = 300;         //шаг отрисовки по y

var widthEl = 75;       //ширина шкафа
var heightEl = 100;      //высота шкафа
var widthCable = 30;       //ширина элемента кабель
var heightCable = 100;      //высота элемента кабель
var widthModule = 10;       //ширина элемента модуль
var heightModule = 30;      //высота элемента модуль (вычисляется не меньше заданной)

var coreDistance = 5 //расстояние между линками

var floors = [];        //массив элементов по этажам
var populationArr =[]   // матрица отслеживания расположения элементов
var elem_types = {
   'firealarm.Element' : 'fireDevice'
  ,'security.Element' : 'controlPanel'
  ,'optical.Element' : 'OpticRack'
}
var device_riser = {
   'security.Element':['riser_up', 'riser_down']
  ,'firealarm.Element':['riser_up', 'riser_down']
}

var markupArray = [];
markupArray['fireAlarm'] =  $('#fireAlarm').html().replace(/(\r\n|\n|\r|\t)/gm,"");
markupArray['pullStation'] =  $('#pullStation').html().replace(/(\r\n|\n|\r|\t)/gm,"");
markupArray['fireEndDevice'] =  $('#fireEndDevice').html().replace(/(\r\n|\n|\r|\t)/gm,"");
markupArray['fireSiren'] =  $('#fireSiren').html().replace(/(\r\n|\n|\r|\t)/gm,"");
markupArray['floorRect'] =  $('#floorRect').html().replace(/(\r\n|\n|\r|\t)/gm,"");

var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
  el: $('#paper'),
  width: paperWidth,
  height: paperHeight,
  model: graph,
  gridSize: 1
});


joint.shapes.defs = {}; 
joint.shapes.defs.NewEl = joint.dia.Element.extend({
  markup: '',
  size: { width: 150, height: 60 },
  defaults:{
      type:'',
      position:{ x: 10 , y: 10 },
      atrrs:{}
  },
  addPointPort: function(){},
  isChild: false
 });
     
var NewEl = function(x, y, width, height, markup, text, text_location, data) {
  
  var height = data ? getModuleHeight(data) * data.cable.module_count : height;
  
  var rect = {};
  if(!markup){
    var rect = {
            fill: '#ffffff',
            stroke: '#000000',
            width: width,
            height: height
         }
  }
  
  
  var markup = markup || '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>';
  var text_color = text_color || "#000";
  var rect_color = rect_color || "#000";
  var text = text || '';
  var text_location = text_location || 'top';
  var zIndex = zIndex;
  var commonModulHeightLeft = 0; //общее высота
  var commonModulHeightRight = 0; //общее высота
  
  //положение текста по умолчанию соответствует значению text_location = 'top'
  var text_x, text_y, text_transform;
  
  switch (text_location) {
    case 'left':
      text_x = width/2;
      text_y = -10;
      text_transform = "rotate(270 "+width/2+","+height/2+")"      
      break;
    case 'right':
      text_x = width/2;
      text_y = height+20;
      text_transform = "rotate(270 "+width/2+","+height/2+")"      
      break;
    case 'bottom':
      text_x = width/2;
      text_y = height+20;//20 заменить на выстоту шрифта
      text_transform = "rotate(0 "+width/2+","+height/2+")"  
      break;
    case 'top':
      text_x = width/2;
      text_y = -10;
      text_transform = "rotate(0 "+width/2+","+height/2+")" ;
      break;
    case 'center':
      text_x = width/2;
      text_y = height/2;
      text_transform = "rotate(0 "+width/2+","+height/2+")" ;
      break;
  }

  var cell = new joint.shapes.defs.NewEl({
      markup: markup,
      type:'defs.NewEl',
      z:zIndex,
       position:{ x: x , y: y },
       attrs:{
         'text':{
           text: text,
           transform: text_transform,
           x: text_x,
           y: text_y,
           'text-anchor': 'middle',
           fill: text_color,
           'font-size': '10px'
         },
         rect: rect, //ghb отсуствии markup формируется в начале
        },
//          ports: {
//            groups: {},
//            items: [ port ]
//        }
   });

  cell.resize(width,height,['top-right']);
  
    // Single port definition
    var port = {
        id: 'abc',
        group: 'a',
        args: {
                  y: 0,
                  x: 0
                },
        attrs: { 
            circle:{
            cx: 0,
            cy: 0,
            r: coreDistance/2,
            stroke: '#000000',
            fill: 'transparent'
          }
        },
        markup: '<circle cx="100" cy="100" r="100"/>'
    };
    

    
//  if(data){
//
//    var moduleHeight = getModuleHeight(data);
////    commonModulHeight = data.cable.module_count *  moduleHeight;
//    var t = data.cable.module_count;
//    do{
//      var i = data.cable.core_count/data.cable.module_count;
//      var firstStep = (moduleHeight - i*coreDistance)/2;
//      do{
//        port.args.x = width/2;
//        port.args.y = firstStep + coreDistance * i + moduleHeight*(t-1);
//        firstStep = 0;
//        port.id = data.id + "_" + t + "_" + i;
//        cell.addPort( port );
//      }while(--i)
//
//    }while(--t)
//  }
    
  cell.addPointPort = function(new_data, side){
    var side = side || 'l';
    var commonModulHeight = side ? commonModulHeightLeft : commonModulHeightRight
    var data = new_data || false;
    if(data){

      var moduleHeight = getModuleHeight(data);
      var t = data.cable.module_count ;;
      do{
        var i = data.cable.core_count/data.cable.module_count;
         var firstStep = (moduleHeight - i*coreDistance)/2;
        do{
          port.args.x = width/2;
          port.args.y = firstStep + coreDistance * i + moduleHeight*(t-1)+ commonModulHeight ;
          firstStep = 0;
          port.id = data.id + "_" + t + "_" + i;
          cell.addPort( port );
        }while(--i)

      }while(--t)
     }
     commonModulHeight += data.cable.module_count *  moduleHeight;
     
     if(side == 'l'){
       commonModulHeightLeft = commonModulHeight;
     } else {
       commonModulHeightRight = commonModulHeight;
     }
     
  };

    return cell;
};

var NewCable = function(x, y, width, height, markup, text, text_location, text_angle, data) {
  
var core_count = data.cable.core_count;
var height = getModuleHeight(data) * data.cable.module_count;

  var rect = {};
  if(!markup){
    var rect = {
            fill: '#ffffff',
            stroke: '#000000',
            width: width,
            height: height
         }
  }
  
  var markup = markup || '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>';
  var text_color = text_color || "#000";
  var rect_color = rect_color || "#000";
  var text = text || '';
  var text_location = text_location || 'center';
  var text_angle = text_angle || 0;
  var zIndex = zIndex;
  
  //положение текста по умолчанию соответствует значению text_location = 'top'
  var text_x, text_y, text_transform;
  var text_angle = text_angle || 0;
  switch (text_location) {
    case 'left':
      text_x = width/2;
      text_y = -10;
      text_transform = "rotate(270 "+width/2+","+height/2+")"      
      break;
    case 'right':
      text_x = width/2;
      text_y = height+20;
      text_transform = "rotate(270 "+width/2+","+height/2+")"      
      break;
    case 'bottom':
      text_x = width/2;
      text_y = height+20;//20 заменить на выстоту шрифта
      text_transform = "rotate(0 "+width/2+","+height/2+")"  
      break;
    case 'top':
      text_x = width/2;
      text_y = -10;
      text_transform = "rotate(0 "+width/2+","+height/2+")" ;
      break;
    case 'center':
      text_x = width/2;
      text_y = height/2;
      text_transform = "rotate("+text_angle+" "+width/2+","+height/2+")" ;
      break;
  }

     // Single port definition
//    var port = {
//        id: 'abc',
//        group: 'a',
//        args: {
//                  y: 0,
//                  x: 0
//               },
//        attrs: { 
//            rect:{
//            width: widthEl,
//            height: heightEl,
//            stroke: 'transparent',
//            fill: 'transparent'
//          }
//        },
//        markup: '<rect  width="10" height="10" stroke="blue"/>'
//    };
    
    var cell = new joint.shapes.defs.NewEl({
        markup: markup,
        type:'defs.NewEl',
        size:{width:width,height:height},
        z:zIndex,
         position:{ x: x , y: y },
         attrs:{
           'text':{
             text: text,
             transform: text_transform,
             x: text_x,
             y: text_y+5,
             'text-anchor': 'middle',
             fill: text_color,
             'font-size': '10px'
           },
           rect: rect, //ghb отсуствии markup формируется в начале
          },
//          ports: {
//            groups: {},
//            items: [ port ]
//        }
     });

//  cell.resize(width,height,['top-right']);
  
  if(data){

   var i = data.cable.module_count
   var height_module = getModuleHeight(data);
   do{
     var new_module =  NewModule( x - widthModule, y + height_module*(i-1), false, height_module, false, 'М '+i, 'center', data, i);
     var new_module2 =  NewModule( x + width, y + height_module*(i-1), false, height_module, false, 'М '+i, 'center', data, i);
     new_module.set('id' , data.id + "_" + i + "_l");
     new_module2.set('id' , data.id + "_" + i + "_r");
     graph.addCells([new_module, new_module2]);
   }while(--i)
  }
  
//    graph.addCell(cell);
    return cell;
};

var NewModule = function(x, y, width, height, markup, text, text_location, data, number) {

var width = width || widthModule;
var height = height > heightModule ? height : heightModule;
//var height = data.cable.core_count/data.cable.module_count ? data.cable.core_count/data.cable.module_count * coreDistance + coreDistance : height; 
 
  var rect = {};
  if(!markup){
    var rect = {
            fill: '#ffffff',
            stroke: '#000000',
            width: width,
            height: height
         }
  }
  
  var markup = markup || '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>';
  var text_color = text_color || "#000";
  var rect_color = rect_color || "#000";
  var text = text || '';
  var text_location = text_location || 'center';
  var text_size = text_size || 6;
  var zIndex = zIndex;
  var number = number || 1;

  //положение текста по умолчанию соответствует значению text_location = 'top'
  var text_x, text_y, text_transform;
  
  switch (text_location) {
    case 'left':
      text_x = width/2;
      text_y = -10;
      text_transform = "rotate(270 "+width/2+","+height/2+")"      
      break;
    case 'right':
      text_x = width/2;
      text_y = height+20;
      text_transform = "rotate(270 "+width/2+","+height/2+")"      
      break;
    case 'bottom':
      text_x = width/2;
      text_y = height+20;//20 заменить на выстоту шрифта
      text_transform = "rotate(0 "+width/2+","+height/2+")"  
      break;
    case 'top':
      text_x = width/2;
      text_y = -10;
      text_transform = "rotate(0 "+width/2+","+height/2+")" ;
      break;
    case 'center':
      text_x = width/2;
      text_y = height/2;
      text_transform = "rotate(270 "+width/2+","+height/2+")" ;
      break;
  }
   
  var cell = new joint.shapes.defs.NewEl({
        markup: markup,
        type:'defs.NewEl',
        z:zIndex,
         position:{ x: x , y: y },
         attrs:{
           'text':{
             text: text,
             transform: text_transform,
             x: text_x,
             y: text_y + text_size/2,
             'text-anchor': 'middle',
             fill: text_color,
             'font-size': text_size
           },
           rect: rect, //ghb отсуствии markup формируется в начале
          },
//          ports: {
//            groups: {},
//            items: [ port ]
//        }
     });

  cell.resize(width,height,['top-right']);
  
  // Single port definition
    var port = {
        id: 'abc',
        group: 'a',
        args: {
                  y: 0,
                  x: 0
                },
        attrs: { 
            rect:{
            width: width,
            height: 1,
            stroke: 'transparent',
            fill: 'transparent'
          },
          text:{}
 
        },
        markup: '<g><rect  width="10" height="10" stroke="blue"/><text></text></g>'
    };
    
  if(data){

   var i = data.cable.core_count/data.cable.module_count ;
   var firstStep = (height - i*coreDistance)/2;
   do{
     port.args.y = firstStep + coreDistance * i;
     firstStep = 0;
     port.id = data.id + "_" + number + "_" + i;
     cell.addPort( port );
     
   }while(--i)
  }
  
  
//    graph.addCell(cell);
    return cell;
};

var NewFloorRect = function(x, y, width, height, markup, text, text_location, text_color, rect_color, zIndex) {
  var x = x;
  var y = y;
  var width = width;
  var height = height;
  var rect = {};
  if(!markup){
    var rect = {
            fill: '#ffffff',
            stroke: '#000000',
            width: width,
            height: height
         }
  }
  
  var markup = markup || '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>';
  var text_color = text_color || "#000";
  var rect_color = rect_color || "#000";
  var text = text || '';
  var text_location = text_location || 'top';
  var zIndex = zIndex;
  
  //положение текста по умолчанию соответствует значению text_location = 'top'
  var text_x, text_y, text_transform;
  var text_r_x, text_r_y, text_r_transform;

  text_r_x = width-15;
  text_r_y = (yStep/2);
  text_r_transform = "rotate(270 "+(width-15)+","+(yStep/2)+")" 
//  text_r_transform="";
  
  text_x = 15;
  text_y = (yStep/2);
  text_transform = "rotate(270 "+(19)+","+(yStep/2)+")" 
    
  var cell = new joint.shapes.defs.NewEl({
        markup: markup,
        type:'defs.NewFloorRect',
//        size:{'width':width,'height':height},
        z:zIndex,
         position:{ x: x , y: y },
         attrs:{
           
           text:{
             'z-index':1000,
             text: text,
             transform: text_transform,
             x: text_x,
             y: text_y,
             'text-anchor': 'middle',
             fill: text_color,
             'font-size': '10px'
           },
          '.textr':{
             'z-index':1000,
             text: text,
             transform: text_r_transform,
             x: text_r_x,
             y: text_r_y,
             'text-anchor': 'middle',
             fill: text_color,
             'font-size': '10px'
           },           
           '.left':{
             fill: '#ffffff',
             stroke: '#000000',
             height: height,
             width: 30,
           },
           '.right':{
             x: width-30,
             fill: '#ffffff',
             stroke: '#000000',
             height: height,
             width: 30,
           },
           '.center':{
            fill: '#ffffff',
            stroke: '#000000',
            width: width,
            height: height
            },
          },

     });

  cell.resize(width,height,['top-right']);
//    graph.addCell(cell);
    return cell;
};
     
var NewLine = function(x1, y1, x2, y2, markup, text, text_location, text_color, line_color, line_width) {

  var x1 = x1;
  var y1 = y1;
  var x2 = x2;
  var y2 = y2;
  var markup = markup || '<g class="rotatable"><line x1="0" y1="0" x2="100" y2="100" stroke="#765373" stroke-width="8"/></g>';
  var text = text || '';
  var text_location = text_location || 'top';
  var text_color = text_color || "#000";
  var line_color = line_color || "#000";
  var line_width = line_width || 2;
   
    var cell = new joint.shapes.defs.NewEl({
        markup: markup,
        size: { },
        type:'defs.NewEl',
         position:{ x: x1 , y: y1 },
         attrs:{
           'text':{
             text: text,
//             transform: text_transform,
             x: x1+50,
             y: -10,
             'text-anchor': 'middle',
             fill: text_color,
             'font-size': '10px'
           },
           'line':{
             x1:x1,
             y1:0,
             x2:x2,
             y2:0
           }
          }
     });

//  cell.resize(width,height,['top-right']);
//    graph.addCell(cell);
    return cell;
};

function getMaxY(t){

  var max = y ;
  if(populationArr.length){
     populationArr.forEach(function(item, i, arr) {
        max = max > arr[i].length ? max : arr[i].length-1;
      });

  } 
  max = max + Math.abs(yStep);
  
  return max;
}
function getNewCoord(x,y,xFix){
  var x = x;
  var y = y;
  var xFix = xFix;

  if(!xFix){

    x = x + xStep;
    if (x + xStep > maxX){
      xStep = -1 * xStep;
      x = x + xStep;
    };
    if (x + xStep < minX){
      xStep = -1 * xStep;
      x = x + xStep;
    };

    if(x in populationArr){
        while (populationArr[x][y]) { 
          y = y + yStep;
        }
    } else {
        populationArr[x]=[];
         while (populationArr[x][y]) { 
          y = y + yStep;
        }
    }

  } else {
    populationArr[x]=[];
  }  
  populationArr[x][y] = 1;//значение в ячейке - занята
//          вычисление свободной y-ячейки  
  return {x:x,y:y};
}
function drawLinks(source_cell, data, cabelSide){
  var data = data ;
  var ports = source_cell.getPorts();
  var core_count = data.cable.core_count/data.cable.module_count;
  var colorsScheme = [];
  if(core_count in colors){
    colorsScheme = colors[core_count];
  }
//  var colorsScheme = colors[]
//смена стороны
if(xStep < 0){
  if(cabelSide == 'l'){
    cabelSide = 'r';
  } else {
    cabelSide = 'l'
  }
}


  var f = ports.length;
  while(f--){
    var port_data = String(ports[f].id).split("_");
    var delta = (ports.length - f)*2 + 5
    var t_id = port_data[0]+"_"+port_data[1]+"_" + cabelSide;
    var t_port = ports[f].id;
    
    //дополнительная точка на линке
    if( cabelSide == 'l'){delta = -delta}
    if( cabelSide == 'r'){delta = delta + widthModule}
      
    var vertices = {
                x:graph.getCell(t_id).prop('position/x') + graph.getCell(t_id).getPort(t_port).args.x + delta,
                y:graph.getCell(t_id).prop('position/y') + graph.getCell(t_id).getPort(t_port).args.y
              }     
    //дополнительная точка на линке
    
    if(data.id == port_data[0]){
      var link = getLink(
          {id: source_cell.id, port: t_port}, 
          {id: t_id, port: t_port},
          vertices
        )
      link.label(0, {
          position: .8,
          attrs: {
              rect: { fill: 'white' },
              text: { fill: colorsScheme[f%colorsScheme.length], text: colorsScheme[f%colorsScheme.length], 'font-size': '8px' }
          }
      });
      link.attr({
          'label':{fill: 'red',text : 'rturtu'},
          '.connection': { stroke: colorsScheme[f%colorsScheme.length] },
//          '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
//          '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
      });
      
      graph.addCell([ link ]); 
    }
  }  
}
function getLink(source, target, vertices){

  var s_id;
  var s_port;
  var t_id;
  var t_port;
  var vertices = vertices || '';
  var number = +number || false;
  var delta = 0 ; //дополнительная точка на линке
  
  if ( typeof source == 'object'){
    s_id = source.id;
    s_port = source.port;
  } else {
    s_id = source;
    s_port = 'abc';
  }
  if ( typeof target == 'object'){
    t_id = target.id;
    t_port = target.port;
  } else {
    t_id = target;
    t_port = 'abc';
  }
    
  var link = new joint.dia.Link({
     source: { id: s_id, port: s_port  },
     target: { id: t_id, port: t_port },
     attrs:{
       manhattan:true //ортогональное расположение
     }
  });
  
  link.set('id', s_id+"_"+s_port+"_"+t_id+"_"+t_port);
  
  link.set('router', {
            name: 'manhattan',
            args: {
              side: 'bottom',
                startDirections: ['right','left'],
                endDirections: ['left','right'],
                excludeTypes : ['defs.NewEl'],
                step: 2,
            }
  });
  link.set('connector', { name: 'normal' }); 
  if(vertices != ''){
    link.set('vertices',[vertices]);
  }

  return link;
}
function sortByCoreCount(a, b) {
  if (a.cableline_data.cable.core_count > b.cableline_data.cable.core_count) return -1;
  if (a.cableline_data.cable.core_count < b.cableline_data.cable.core_count) return 1;
}
function getModuleHeight(data){
  var data = data;
  if (data){
   var  calculatedHeight = data.cable.core_count/data.cable.module_count * coreDistance + coreDistance;
    
    return calculatedHeight >  heightModule ? calculatedHeight : heightModule;
  }
  return 0;
}


function draw(elem_type){

  var elem_type = elem_type;
  var cableLog =[];
  var devices = {} // ид девайсов как имя свойства
  var source_target = []; //массив объектов source - target
  

  var cabinets_core_count = {};
  var main_cabinet_id;
  
  for(var j in floors){
    cableLog = floors[j].cableLog;
    
    cabinets_core_count = getCabinetsCoreCount(cableLog, elem_type);
      
    main_cabinet_id = getMaxCoreCabinetId(cabinets_core_count);
    devices[main_cabinet_id] = 1;
    
    source_target = getSourceTarget(cableLog,elem_type, devices, j);
    
    drawSorceTarget( source_target);

  }
}
//получаем количество core в шкафах
function getCabinetsCoreCount(cableLog, elem_type){
  var cableLog = cableLog;
  var result = {};
  
  for(var i in cableLog){
    
      
    if(cableLog[i].finish_sysname == elem_types[elem_type] &&
      cableLog[i].full_path[cableLog[i].full_path.length-1].elem_type == elem_type){
      
      result[cableLog[i].finish_id] += cableLog[i].cableline_data.cable.core_count;
    }
      
    if(cableLog[i].start_sysname == elem_types[elem_type] &&
      cableLog[i].full_path[0].elem_type == elem_type){
      
      result[cableLog[i].finish_id] += cableLog[i].cableline_data.cable.core_count;
    }
    
  }
  return result;
}
//получаем ид шкафа с макс значением суммсщку
function getMaxCoreCabinetId(arr){
  var arr = arr;
  var max = 0;
  for(var i in arr){
    max = max > arr[i] ? max : arr[i];
  }
  return i;
}
//получаем объекты source - target по ид девайсов
function getSourceTarget(cableLog, elem_type, devices, floorNumber){
  var result = [];
  var cableLog = cableLog;
  var elem_type = elem_type;
  var floorNumber = floorNumber;
  var device = false;
  
  var all_devices = false;
  var anotherFloor_devices = false;
  
      for(var device_id in devices){
//        device = getNextLine(floorNumber, 0, device_id);//последовательное получение линий элементов (согласно маркировке)
//        while(device){
//            result.push(device);
//          device = getNextLine(floorNumber, +device.number, device_id);//последовательное получение линий элементов (согласно маркировке)
//        }
//        another_devices = getAnotherLine(floorNumber, device_id);//получение линий элементов с пустой маркировкой
        all_devices = getAllLine(floorNumber, device_id);//получение линий элементов с пустой маркировкой
        
        result = result.concat(all_devices);
      }
      
  return result;
}

//получение линий элементов с пустой маркировкой
function getAllLine(floorNumber, device_id){      
  
  var floorNumber = floorNumber;
  var device_id = device_id;
  var cableLog ;
  var device ;
  var result = [];
  
  cableLog = floors[floorNumber].cableLog;
  
  for(var i in cableLog){
    device = new Object();
    device.source = {};
    device.target = {};

    device.floor_number = floorNumber;
    device.index = i;
    device.cableline_data = cableLog[i].cableline_data;
    
    if(cableLog[i].finish_id == device_id){
      
      device.source.id = cableLog[i].finish_id;
      device.source.name = cableLog[i].finish_sysname;
      device.source.marking = cableLog[i].finish_marking[0];
      device.source.title = cableLog[i].finish_title;

      device.target.id = cableLog[i].start_id;
      device.target.name = cableLog[i].start_sysname;
      device.target.marking = cableLog[i].start_marking[0];
      device.target.title = cableLog[i].start_title;
      device.target.location = 'start';
      
        device.number = device.target.marking !='' ? String(device.target.marking).split('.')[0] : '' ;

          result.push(device);
  
    }
    
    if(cableLog[i].start_id == device_id ){
      device.source.id = cableLog[i].start_id;
      device.source.name = cableLog[i].start_sysname;
      device.source.marking = cableLog[i].start_marking[0];
      device.source.title = cableLog[i].start_title;

      device.target.id = cableLog[i].finish_id;
      device.target.name = cableLog[i].finish_sysname;
      device.target.marking = cableLog[i].finish_marking[0];
      device.target.title = cableLog[i].finish_title;
      device.target.location = 'finish';
      
      device.number = device.target.marking !='' ? String(device.target.marking).split('.')[0] : '' ;
        result.push(device);
    }    
  } 
  return result;
}


//обход элементов source-target для отрисовки согласно массиву 
function drawSorceTarget( source_target){
  
  var source_target = source_target;
  var startX = x;
  var startY = y;
  var cableLog;

  source_target.sort(sortByCoreCount);//сортировка по этажам
  for(var i in source_target ){
    cableLog = floors[source_target[i].floor_number].cableLog;  
    drawDevice2(cableLog, source_target[i], startX, startY, i);
  }
}
//отрисовка девайса и первого зависимого элемента согласно объекту device
function drawDevice2(cableLog, device, x, y, deviceNumber){
  var cableLog = cableLog;
  var x = x;
  var y = y;
  var index = index;
  var device = device ;
  var point = {};
  var floorRect;
  var rect_y; //y координата начала прямоугольника этажа
  var rect_height;//высота прямоугольника этажа
  var elements; //массив всех элементо для проверки наличия floor rect
  var isFirstFloorRect = true;
  var link;
  var flag = false;



  //прорисовываем шкаф 
  point = getNewCoord(x,y,true);
  var source_cell = graph.getCell(device.source.id);
  if ( typeof source_cell == 'undefined'){
    //вычисление свободной y-ячейки
    //добавление элемента

    var source_cell = NewEl(x, y, widthEl, heightEl, markupArray[device.source.name], device.source.title +'\n'+device.source.id , 'top', device.cableline_data)

    source_cell.set('id', device.source.id);
    graph.addCell([source_cell]); 
    source_cell.addPointPort(device.cableline_data);
    
  } else {
//    if(source_cell.isChild){
//      var old_height = source_cell.prop('size/height');
//      source_cell.prop('size/height', old_height + getModuleHeight(device.cableline_data) * device.cableline_data.cable.module_count);
//      flag = 1;
//    }
//    source_cell.resize(width,height,['top-right']);
  }

  if(+deviceNumber > 0) {
    y = getMaxY();
  } ;

  xStep = Math.abs(xStep);//ifu в положительное значение
//прорисовываем шкаф



//прорисовываем таргет-шкаф
var target_cell = graph.getCell(device.target.id);
  if ( typeof target_cell == 'undefined'){

    //добавляем порты и меняем высоту родителя
    if(source_cell.isChild){
      var old_height = source_cell.prop('size/height');
      source_cell.prop('size/height', old_height + getModuleHeight(device.cableline_data) * device.cableline_data.cable.module_count);
      source_cell.addPointPort(device.cableline_data);
    }
    //добавляем порты и меняем высоту родителя
            
            
    point = getNewCoord(x,y);//вычисление свободной y-ячейки
    x = point.x;
    y = point.y;
    //добавление элемента
    var target_cell = NewEl( point.x, point.y, widthEl, heightEl, markupArray[device.target.name], device.target.title+'\n'+device.target.id, 'top', device.cableline_data)

    target_cell.set('id', device.target.id);
    graph.addCell([target_cell]);
    source_cell.isChild = true;
    target_cell.addPointPort(device.cableline_data,'r');  
    
  } else {
    
      var old_height = target_cell.prop('size/height');
      target_cell.prop('size/height', old_height + device.cableline_data.cable.core_count * coreDistance);
    
  }
//прорисовываем таргет-шкаф


//прорисовываем кабель
  if ( typeof graph.getCell(device.cableline_data.id) == 'undefined'){
    
    //вычисление координат
    point = getNewCabelCoord(point);
    //добавление элемента
    var element = NewCable( point.x, point.y, widthCable, heightCable, false, device.cableline_data.cable.id, 'center', 270, device.cableline_data)
    element.set('id', device.cableline_data.id);
    graph.addCell([element]);

  }
//прорисовываем кабель


//прорисовываем линки
//if(flag){
//  source_cell.addPointPort(device.cableline_data);
//}

drawLinks(source_cell, device.cableline_data, "l");
drawLinks(target_cell, device.cableline_data, "r");
    
    
 drawElement2(cableLog, device.source.id, device.target.id, x, y, device.index, device.number, device.target.location);


}
//Отрисовка элемента по target_id
function drawElement2(cableLog, source_id, target_id, x, y, index, number, target_location){
  //параметры
  var cableLog = cableLog;
  var source_id = source_id;
  var target_id = target_id;
  var x = x;
  var y = y;
  var index = index;
  var number = number || '';
  var target_location = target_location; //положение(start/finish) target в элементе source
  //локальные
  var start_id;
  var finish_id;
 
  var new_target_id;
  var new_elem_sysname;;
  var new_marking;
  var new_title;
  var new_location;

  var elem_sysname;
  var marking; 

  
  var source_cell = graph.getCell(target_id); //новый источник
  //проход по каталогу cableLog
  for(var i in cableLog){
      //исключаем  индекс элемента 
    if( i != index){

      start_id = cableLog[i].start_id;
      finish_id = cableLog[i].finish_id;

//       
      if(( finish_id == target_id /*&& target_location == 'start'*/) || (start_id == target_id /*&& target_location == 'finish'*/)){

          
        if( finish_id == target_id /*&& target_location == 'start'*/){
          new_target_id = cableLog[i].start_id;
          new_elem_sysname = cableLog[i].start_sysname;
          new_marking = cableLog[i].start_marking[0];
          new_title = cableLog[i].start_title;
          new_location = 'start';

          elem_sysname = cableLog[i].finish_sysname;
          marking = cableLog[i].finish_marking[0];

        } else if(start_id == target_id /*&& target_location == 'finish'*/){
          new_target_id = cableLog[i].finish_id;
          new_elem_sysname = cableLog[i].finish_sysname;
          new_marking = cableLog[i].finish_marking[0];
          new_title = cableLog[i].finish_title;
          new_location = 'finish';

          elem_sysname = cableLog[i].start_sysname;
          marking = cableLog[i].start_marking[0];
        } 
        
//        if(number == String(marking).split('.')[0] ){
          var new_target_cell = graph.getCell(new_target_id);
          if ( typeof target_cell == 'undefined'){
            
                       
            
            var point = getNewCoord(x,y);//вычисление свободной y-ячейки
            x = point.x;
            y = point.y;

            //добавляем порты и меняем высоту родителя
            if(source_cell.isChild){
              var old_height = source_cell.prop('size/height');
              source_cell.prop('size/height', old_height + getModuleHeight(cableLog[i].cableline_data) * cableLog[i].cableline_data.cable.module_count);
            }
            source_cell.addPointPort(cableLog[i].cableline_data);
            //добавляем порты и меняем высоту родителя
            
            
            //добавление элемента
            var new_target_cell = NewEl(x, y, widthEl, heightEl, markupArray[new_elem_sysname], new_title +'\n'+new_target_id, 'top', cableLog[i].cableline_data)
            new_target_cell.set('id', new_target_id);
            graph.addCell([new_target_cell]);
            source_cell.isChild = true;
            new_target_cell.addPointPort(cableLog[i].cableline_data, 'r')
            //добавление элемента
            
            
            //прорисовываем кабель
            if ( typeof graph.getCell(cableLog[i].cableline_data.id) == 'undefined'){
              //вычисление координат
              point = getNewCabelCoord(point);
              //добавление элемента
              var element = NewCable( point.x, point.y, widthCable, heightCable, false, cableLog[i].cableline_data.cable.id, 'center', 270, cableLog[i].cableline_data)
              element.set('id', cableLog[i].cableline_data.id);
              graph.addCell([element]);
            }
            //прорисовываем кабель 
            
            source_id = target_id

          //Добавляем линки
          drawLinks(source_cell, cableLog[i].cableline_data, "l");
          drawLinks(new_target_cell, cableLog[i].cableline_data, "r");
          
          drawElement2(cableLog, source_id,new_target_id, x, y, i, number, new_location);
          x = x - xStep;
          
        } 
        
  
  
      }    
    }
  }              
}

function getNewCabelCoord(point){
  var point = point;
   if(xStep < 0){
      point.x = point.x + (Math.abs(xStep)-widthEl)/2 - widthCable/2 + widthEl;
    } else {
      point.x = point.x - (Math.abs(xStep)-widthEl)/2 - widthCable/2;
    }
    return point;
}










//последовательное получение линий элементов (согласно маркировке)
function getNextLine(floorNumber, number, device_id ){
  
  var floorNumber = floorNumber;
  var device_id = device_id;
  var cableLog;
  var device;
  var cableLog = cableLog;
  var number = number;
  
  cableLog = floors[floorNumber].cableLog;
  
  for(var i in cableLog){
    device = {};
    device.source = {};
    device.target = {};

    device.floor_number = floorNumber;
    device.index = i;
    device.cableline_data = cableLog[i].cableline_data;
    
    if(cableLog[i].finish_id == device_id){
      device.source.id = cableLog[i].finish_id;
      device.source.name = cableLog[i].finish_sysname;
      device.source.marking = cableLog[i].finish_marking[0];
      device.source.title = cableLog[i].finish_title;

      device.target.id = cableLog[i].start_id;
      device.target.name = cableLog[i].start_sysname;
      device.target.marking = cableLog[i].start_marking[0];
      device.target.title = cableLog[i].start_title;
      device.target.location = 'start';

        device.number = device.target.marking !='' ? String(device.target.marking).split('.')[0] : '' ;
        if( device.number == (number+1)){
          return device;
        }
 
    }
    
    if(cableLog[i].start_id == device_id){
      device.source.id = cableLog[i].start_id;
      device.source.name = cableLog[i].start_sysname;
      device.source.marking = cableLog[i].start_marking[0];
      device.source.title = cableLog[i].start_title;

      device.target.id = cableLog[i].finish_id;
      device.target.name = cableLog[i].finish_sysname;
      device.target.marking = cableLog[i].finish_marking[0];
      device.target.title = cableLog[i].finish_title;
      device.target.location = 'finish';
      
      device.number = device.target.marking !='' ? String(device.target.marking).split('.')[0] : '' ;

      if( device.number == (number+1)){
          return device;
        }
    }    
  } 
  return false;
}
//получение линий элементов с пустой маркировкой
function getAnotherLine(floorNumber, device_id){      
  
  var floorNumber = floorNumber;
  var device_id = device_id;
  var cableLog ;
  var device ;
  var result = [];
  
  cableLog = floors[floorNumber].cableLog;
  
  for(var i in cableLog){
    device = new Object();
    device.source = {};
    device.target = {};

    device.floor_number = floorNumber;
    device.index = i;
    device.cableline_data = cableLog[i].cableline_data;
    
    if(cableLog[i].finish_id == device_id){
      
      device.source.id = cableLog[i].finish_id;
      device.source.name = cableLog[i].finish_sysname;
      device.source.marking = cableLog[i].finish_marking[0];
      device.source.title = cableLog[i].finish_title;

      device.target.id = cableLog[i].start_id;
      device.target.name = cableLog[i].start_sysname;
      device.target.marking = cableLog[i].start_marking[0];
      device.target.title = cableLog[i].start_title;
      device.target.location = 'start';
      
        device.number = device.target.marking !='' ? String(device.target.marking).split('.')[0] : '' ;
        if(device.number == ""){
          result.push(device);
        }
    }
    
    if(cableLog[i].start_id == device_id ){
      device.source.id = cableLog[i].start_id;
      device.source.name = cableLog[i].start_sysname;
      device.source.marking = cableLog[i].start_marking[0];
      device.source.title = cableLog[i].start_title;

      device.target.id = cableLog[i].finish_id;
      device.target.name = cableLog[i].finish_sysname;
      device.target.marking = cableLog[i].finish_marking[0];
      device.target.title = cableLog[i].finish_title;
      device.target.location = 'finish';
      
      device.number = device.target.marking !='' ? String(device.target.marking).split('.')[0] : '' ;

      if(device.number == ""){
        result.push(device);
      }
    }    
  } 
  return result;
}

//получение линий элементов после riser из другого этажа
function getAnotherFloorLine( outside_device, floorNumber){ 
  var cableLog;
  var outside_device = outside_device;
  var floorNumber = floorNumber;
  var device ;
  var result = [];
  
  for(var j in floors){
    if(j != floorNumber){
      cableLog = floors[j].cableLog;
      for(var i in cableLog){
        device = new Object();
        device.source = {};
        device.target = {};

        device.index = i;
        device.floor_number = j;
        
        if(cableLog[i].finish_id == outside_device.target.id){

          device.source.id = outside_device.source.id;//подмена id 
          device.source.name = outside_device.source.name;//подмена name 
          device.source.marking = cableLog[i].finish_marking[0];
          
          device.target.id = cableLog[i].start_id;
          device.target.name = cableLog[i].start_sysname;
          device.target.marking = cableLog[i].start_marking[0];
          device.target.location = 'start';

            device.number = device.target.marking !='' ? String(device.target.marking).split('.')[0] : '' ;
              result.push(device);
        }

        if(cableLog[i].start_id == outside_device.target.id ){
          device.source.id = outside_device.source.id;//подмена id 
          device.source.name = outside_device.source.name;//подмена name 
          device.source.marking = cableLog[i].start_marking[0];

          device.target.id = cableLog[i].finish_id;
          device.target.name = cableLog[i].finish_sysname;
          device.target.marking = cableLog[i].finish_marking[0];
          device.target.location = 'finish';

          device.number = device.target.marking !='' ? String(device.target.marking).split('.')[0] : '' ;

            result.push(device);
         
        }    
      } 
    }
  }
  return result;
}


//получаем девайсы
function getDevices(cableLog, elem_type){
  var devices = {};
  var cableLog = cableLog;
  var elem_type = elem_type;

  for(var i in cableLog){

    if(cableLog[i].finish_sysname == elem_types[elem_type] &&
      cableLog[i].full_path[cableLog[i].full_path.length-1].elem_type == elem_type){
      
      if(!(cableLog[i].finish_id in devices))
        devices[(cableLog[i].finish_id)] = 1;
    }
    if(cableLog[i].start_sysname == elem_types[elem_type] &&
      cableLog[i].full_path[0].elem_type == elem_type){
      
      if(!(cableLog[i].start_id in devices))
        devices[(cableLog[i].start_id)] = 1;
    }
    
  } 
  return devices;
}

//получаем девайсы перехода
function getDeviceRisers(cableLog, elem_type){
  var devices = {};
  var cableLog = cableLog;
  var elem_type = elem_type;


  for(var i in cableLog){

    if(cableLog[i].finish_sysname == elem_types[elem_type] &&
      cableLog[i].full_path[cableLog[i].full_path.length-1].elem_type == elem_type){
      
      if(!(cableLog[i].finish_id in devices))
        devices[(cableLog[i].finish_id)] = 1;
    }
    if(cableLog[i].start_sysname == elem_types[elem_type] &&
      cableLog[i].full_path[0].elem_type == elem_type){
      
      if(!(cableLog[i].start_id in devices))
        devices[(cableLog[i].start_id)] = 1;
    }
    
  } 
  return devices;
}



$(document).ready(function(e)
{
  $.ajax({
    type: 'POST',
    dataType:'json',
    url: '../data/data_optica.json',
    success: function(response){
      var data = response;
      floors = data.floors;
      draw('optical.Element');
    }
	});
});