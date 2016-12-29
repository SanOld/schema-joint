var paperWidth = 1300;  //ширина холста
var paperHeight = 3000; //высота холста
var minX = x;           //граница отрисовки
var minY = y;           //граница отрисовки
var maxX = paperWidth;  //граница отрисовки
var maxY = paperHeight; //граница отрисовки

var y = 100;            //начальное положение первого элемента по x
var x = 100;            //начальное положение первого элемента по н
var yStep = 150;         //шаг отрисовки по x
var xStep = 150;         //шаг отрисовки по y

var widthEl = 75;       //ширина шкафа
var heightEl = 100;      //высота шкафа
var widthCable = 50;       //ширина элемента
var heightCable = 100;      //высота элемента
var widthModule = 20;       //ширина элемента
var heightModule = 40;      //высота элемента


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
  }
 });
     
var NewEl = function(x, y, width, height, markup, text, text_location, text_color, rect_color, zIndex) {
  
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
            width: widthEl,
            height: heightEl,
            stroke: 'transparent',
            fill: 'transparent'
          }
        },
        markup: '<rect  width="10" height="10" stroke="blue"/>'
    };
    
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
          ports: {
            groups: {},
            items: [ port ]
        }
     });

  cell.resize(width,height,['top-right']);
//    graph.addCell(cell);
    return cell;
};

var NewCable = function(x, y, width, height, markup, text, text_location, text_angle, data) {

  var rect = {};
  if(!markup){
    var rect = {
            fill: '#ffffff',
            stroke: '#000000',
            width: width,
            height: height
         }
  }
//  if(data){
//    markup = '<g class="rotatable"><g class="scalable">';
//   var i = data.cable.module_count
//   while(i--){
//     markup += '<rect class="rect-modul"/><text class="text-modul"/>'
//   }
//   markup += '</g><text/></g>';
//  }
  
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

//  cell.resize(width,height,['top-right']);
  
  if(data){

   var i = data.cable.module_count
   var port_step = widthModule/data.cable.core_count;
   while(i--){
     var new_module =  NewModule( x - widthModule, y + heightModule*i, false, false, false, 'module '+i, 'center', data);
     var new_module2 =  NewModule( x + width, y + heightModule*i, false, false, false, 'module '+i, 'center', data);
     new_module.set('id' , data.id + "_l" + i);
     new_module2.set('id' , data.id + "_r" + i);
     graph.addCells([new_module, new_module2]);
   }
  }
  
//    graph.addCell(cell);
    return cell;
};

var NewModule = function(x, y, width, height, markup, text, text_location, data) {

var width = width || widthModule;
var height = height || heightModule;
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
  var text_size = text_size || 8;
  var zIndex = zIndex;

  
  

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
             y: text_y,
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
            width: 5,
            height: heightModule,
            stroke: 'transparent',
            fill: 'transparent'
          }
        },
        markup: '<rect  width="10" height="10" stroke="blue"/>'
    };
    
    
  if(data){

   var i = data.cable.core_count/data.cable.module_count;
   var port_step = widthModule/data.cable.core_count;
   while(i--){
//     var new_port = new port;
     port.args.x = port_step * i;
     port.id = i;
     cell.addPort( port );
   }
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
function getLink(source_id, target_id, vertices){
  var source_id = source_id;
  var target_id = target_id;
  var vertices = vertices || '';
  
  var link = new joint.dia.Link({
     source: { id: source_id, port: 'abc'  },
     target: { id: target_id, port: 'abc' },
     attrs:{
       manhattan:true //ортогональное расположение
     }
  });
  link.set('router', {
            name: 'manhattan',
//                name: 'oneSide',
            args: {
              side: 'bottom',
                startDirections: ['right','left'],
                endDirections: ['left','right'],
                excludeTypes : ['defs.NewEl'],
                step: 2,
      //                    padding: 5
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
    devices[main_cabinet_id] = 1
    
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
  
  var another_devices = false;
  var anotherFloor_devices = false;
  
      for(var device_id in devices){
        device = getNextLine(floorNumber, 0, device_id);//последовательное получение линий элементов (согласно маркировке)
        while(device){
            result.push(device);
          device = getNextLine(floorNumber, +device.number, device_id);//последовательное получение линий элементов (согласно маркировке)
        }
        another_devices = getAnotherLine(floorNumber, device_id);//получение линий элементов с пустой маркировкой
        result = result.concat(another_devices);
      }
      
  return result;
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
      try{
        device.number = device.target.marking !='' ? String(device.target.marking).split('.')[0] : '' ;
        if( device.number == (number+1)){
          return device;
        }
      } catch(err){
        window.console.log(device.target);
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
  var device = device;
  var point = {};
  var floorRect;
  var rect_y; //y координата начала прямоугольника этажа
  var rect_height;//высота прямоугольника этажа
  var elements; //массив всех элементо для проверки наличия floor rect
  var isFirstFloorRect = true;
  var link;


  //прорисовываем шкаф 
  point = getNewCoord(x,y,true);
  if ( typeof graph.getCell(device.source.id) == 'undefined'){
    //вычисление свободной y-ячейки
    //добавление элемента
    var main = NewEl(x, y, widthEl, heightEl, markupArray[device.source.name], device.source.title +"\n"+device.source.id, 'top', null, 'green')
    main.set('id', device.source.id);
    graph.addCell([main]);

  }

  if(+deviceNumber > 0) {
    y = getMaxY();
  } ;

  xStep = Math.abs(xStep);//ifu в положительное значение

//прорисовываем шкаф


//прорисовываем кабель
  if ( typeof graph.getCell(device.cableline_data.id) == 'undefined'){
    point = getNewCoord(x,y);//вычисление свободной y-ячейки
    x = point.x;
    y = point.y;
      //добавление элемента
//                          (x, y, width, height, markup, text, text_location, data)
    var element = NewCable( point.x, point.y, widthCable, heightCable, false, device.cableline_data.cable.name, 'center', 270, device.cableline_data)
    element.set('id', device.cableline_data.id);
    graph.addCell([element]);
  
  }

//прорисовываем кабель



  //прорисовываем таргет шкафа
  if ( typeof graph.getCell(device.target.id) == 'undefined'){

    point = getNewCoord(x,y);//вычисление свободной y-ячейки
    x = point.x;
    y = point.y;
    //добавление элемента
    var element = NewEl( point.x, point.y, widthEl, heightEl, markupArray[device.target.name], device.target.title+"\n"+device.target.id, 'top', null, 'green')
    element.set('id', device.target.id);
    graph.addCell([element]);
    
    var vertices = {x:point.x-xStep/5-1,y:point.y+element.getPort('abc').attrs.rect.height/2}; //доп точка на линке
    link = getLink(device.source.id, device.target.id,vertices);
    
    graph.addCell([link]);
    
  }

//прорисовка элементов
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
        
        
        if(number == String(marking).split('.')[0] ){
          if ( typeof graph.getCell(new_target_id) == 'undefined'){
            
            var point = getNewCoord(x,y);//вычисление свободной y-ячейки
            x = point.x;
            y = point.y;
  //            var coor = "x:"+x+" y:"+y;  
  //          добавление элемента
            var IZ = NewEl(x,y,widthEl,heightEl,markupArray[new_elem_sysname], new_title +'\n'+new_target_id,'top', null, 'green')
            IZ.set('id', new_target_id);
            graph.addCell([IZ]);
  //          добавление элемента

            source_id = target_id
  //          добавление линки между элементами
            graph.addCell([getLink(source_id, new_target_id)]); 
  //           добавление линки между элементами
          }  

          drawElement2(cableLog, source_id,new_target_id, x,y,i,number, new_location);
          x = x - xStep;
        }
  
      }    
    }
  }              
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
//      draw('security.Element');
    }
	});
});