var floors = [];        //массив элементов по этажам
var yStep = 60;         //шаг отрисовки по x
var xStep = 60;         //шаг отрисовки по y
var y = 100;            //начальное положение первого элемента по x
var x = 100;            //начальное положение первого элемента по н
var populationArr =[]   // матрица отслеживания расположения элементов
var widthEl = 25;       //ширина элемента
var heightEl = 25;      //высота элемента
var paperWidth = 1300;  //ширина холста
var paperHeight = 3000; //высота холста
var minX = x;           //граница отрисовки
var minY = y;           //граница отрисовки
var maxX = paperWidth;  //граница отрисовки
var maxY = paperHeight; //граница отрисовки
var elem_types = {
   'firealarm.Element' : 'fireDevice'
  ,'security.Element' : 'controlPanel'
}
var device_riser = {
  'security.Element':['riser_up', 'riser_down']
}

var markupArray = [];
markupArray['fireAlarm'] =  $('#fireAlarm').html().replace(/(\r\n|\n|\r|\t)/gm,"");
markupArray['pullStation'] =  $('#pullStation').html().replace(/(\r\n|\n|\r|\t)/gm,"");; 
markupArray['fireEndDevice'] =  $('#fireEndDevice').html().replace(/(\r\n|\n|\r|\t)/gm,"");; 
markupArray['fireSiren'] =  $('#fireSiren').html().replace(/(\r\n|\n|\r|\t)/gm,"");;

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
  defaults:{
      type:'defs.NewEl',
      position:{ x: 10 , y: 10 },
      atrrs:{}
  }
 });
     
var NewEl = function(x, y, width, height, markup, text, text_location, text_color, rect_color) {
  
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
        markup: '<rect  width="10" height="10" stroke="bue"/>'
    };
    
    var cell = new joint.shapes.defs.NewEl({
        markup: markup,
        type:'defs.NewEl',
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
           rect: rect //ghb отсуствии markup формируется в начале
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

function getMaxY(floor){
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
function getLink(source_id, target_id){
  var source_id = source_id;
  var target_id = target_id;
  
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
                startDirections: ['right','left','top','bottom'],
                endDirections: ['left','right','top','bottom'],
      //          excludeTypes : ['defs.NewEl'],
                step: 2,
      //                    padding: 5
            }
  });
  link.set('connector', { name: 'normal' }); 
  
  return link;
}



function draw(elem_type){

  var elem_type = elem_type;
  var cableLog =[];
  var devices = {} // ид девайсов как имя свойства
  var device_risers = {} // ид девайсов прехода как имя свойства
  var source_target = []; //массив объектов source - target
  
  for(var j in floors){
    cableLog = floors[j].cableLog;
    // ид девайсов
    devices = getDevices(cableLog, elem_type);
    device_risers = getDeviceRisers(cableLog, elem_type);
    //массив объектов source - target
    source_target = getSourceTarget(cableLog,devices);
    
    //отрисовка девайсов и зависимых элементов
    drawSorceTaeget(cableLog, source_target, j);
 
  }
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
//получаем объекты source - target по ид девайсов
function getSourceTarget(cableLog,devices){
  var result = [];
  var cableLog = cableLog;
  var device = false;
  var another_devices = false;
  
      for(var device_id in devices){
        device = getNextLine(cableLog, 0, device_id);//последовательное получение линий элементов (согласно маркировке)
        while(device){
          result.push(device);
          device = getNextLine(cableLog, +device.number, device_id);//последовательное получение линий элементов (согласно маркировке)
        }
        another_devices = getAnotherLine(cableLog, device_id);//получение линий элементов с пустой маркировкой
        result = result.concat(another_devices);
      }
  return result;
}

//последовательное получение линий элементов (согласно маркировке)
function getNextLine(cableLog, number, device_id ){
  var cableLog = cableLog;
  var device_id = device_id;
  var device;
  var cableLog = cableLog;
  var number = number;
  
  for(var i in cableLog){
    device = {};
    device.source = {};
    device.target = {};

      
    if(cableLog[i].finish_id == device_id){
      device.source.id = cableLog[i].finish_id;
      device.source.name = cableLog[i].finish_sysname;
      device.source.marking = cableLog[i].finish_marking[0];
      device.index = i;
      device.target.id = cableLog[i].start_id;
      device.target.name = cableLog[i].start_sysname;
      device.target.marking = cableLog[i].start_marking[0];
      device.target.location = 'start';
      
        device.number = device.target.marking !='' ? device.target.marking.split('.')[0] : '' ;
        if( device.number == (number+1)){
          return device;
        }
    }
    
    if(cableLog[i].start_id == device_id){
      device.source.id = cableLog[i].start_id;
      device.source.name = cableLog[i].start_sysname;
      device.source.marking = cableLog[i].start_marking[0];
      device.index = i;
      device.target.id = cableLog[i].finish_id;
      device.target.name = cableLog[i].finish_sysname;
      device.target.marking = cableLog[i].finish_marking[0];
      device.target.location = 'finish';
      
      device.number = device.target.marking !='' ? device.target.marking.split('.')[0] : '' ;

      if( device.number == (number+1)){
          return device;
        }
    }    
  } 
  return false;
}
//получение линий элементов с пустой маркировкой
function getAnotherLine(cableLog, device_id){      
  var cableLog = cableLog;
  var device_id = device_id;
  var device ;
  var result = [];
  
  for(var i in cableLog){
    device = new Object();
    device.source = {};
    device.target = {};

    if(cableLog[i].finish_id == device_id){
      
      device.source.id = cableLog[i].finish_id;
      device.source.name = cableLog[i].finish_sysname;
      device.source.marking = cableLog[i].finish_marking[0];
      device.index = i;
      device.target.id = cableLog[i].start_id;
      device.target.name = cableLog[i].start_sysname;
      device.target.marking = cableLog[i].start_marking[0];
      device.target.location = 'start';
      
        device.number = device.target.marking !='' ? device.target.marking.split('.')[0] : '' ;
        if(device.number == ""){
          result.push(device);
        }
    }
    
    if(cableLog[i].start_id == device_id ){
      device.source.id = cableLog[i].start_id;
      device.source.name = cableLog[i].start_sysname;
      device.source.marking = cableLog[i].start_marking[0];
      device.index = i;
      device.target.id = cableLog[i].finish_id;
      device.target.name = cableLog[i].finish_sysname;
      device.target.marking = cableLog[i].finish_marking[0];
      device.target.location = 'finish';
      
      device.number = device.target.marking !='' ? device.target.marking.split('.')[0] : '' ;

      if(device.number == ""){
        result.push(device);
      }
    }    
  } 
  return result;
}
//обход элементов source-target для отрисовки согласно массиву 
function drawSorceTaeget(cableLog, source_target, floorNumber){
  var source_target = source_target;
  var startX = x;
  var startY = y;
  
  for(var i in source_target ){

    if(+floorNumber > 0) {
      startY = getMaxY();
    } 
      
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
      
      //прорисовываем прибор
//      
      point = getNewCoord(x,y,true);
      if ( typeof graph.getCell(device.source.id) == 'undefined'){
        //вычисление свободной y-ячейки
        //добавление элемента
        var FD = NewEl(x, y,widthEl, heightEl, markupArray[device.source.name], device.source.marking ? device.source.marking : device.source.name, 'left', null, 'green')
        FD.set('id', device.source.id);
        graph.addCell([FD]);
        
      }
      
      if(+deviceNumber > 0) {
        y = getMaxY();
      } ;
      
      xStep = Math.abs(xStep);//ifu в положительное значение
      
      //прорисовываем таргет прибора
      if ( typeof graph.getCell(device.target.id) == 'undefined'){

        point = getNewCoord(x,y);//вычисление свободной y-ячейки
        x = point.x;
        y = point.y;
        //добавление элемента
        var FD = NewEl( point.x, point.y, widthEl, heightEl, markupArray[device.target.name], device.target.marking ? device.target.marking : device.target.name, 'left', null, 'green')
        FD.set('id', device.target.id);
        graph.addCell([FD]);
        graph.addCell([getLink(device.source.id, device.target.id)]); 
      }
      
//      if(device.number != '')
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
          new_location = 'start';

          elem_sysname = cableLog[i].finish_sysname;
          marking = cableLog[i].finish_marking[0];

        } else if(start_id == target_id /*&& target_location == 'finish'*/){
          new_target_id = cableLog[i].finish_id;
          new_elem_sysname = cableLog[i].finish_sysname;
          new_marking = cableLog[i].finish_marking[0];
          new_location = 'finish';

          elem_sysname = cableLog[i].start_sysname;
          marking = cableLog[i].start_marking[0];
        } 
        
        
        if(number == marking.split('.')[0] ){
          if ( typeof graph.getCell(new_target_id) == 'undefined'){
            
            var point = getNewCoord(x,y);//вычисление свободной y-ячейки
            x = point.x;
            y = point.y;
  //            var coor = "x:"+x+" y:"+y;  
  //          добавление элемента
            var IZ = NewEl(x,y,widthEl,heightEl,markupArray[new_elem_sysname], new_marking ? new_marking : new_elem_sysname,'left', null, 'green')
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


$(document).ready(function(e)
{
  $.ajax({
    type: 'POST',
    dataType:'json',
    url: '../data/data_spusk.json',
    success: function(response){
      var data = response;
      floors = data.floors;
//      draw('fireDevice.Element');
      draw('security.Element');
    }
	});
});