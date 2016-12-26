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
   'fireDevice' : 'firealarm.Element'
  ,'controlPanel' : 'security.Element'
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
   
//Отрисовка элементов
function drawP(){
  var cableLog =[];
  var index;
  for(var j in floors){
    cableLog = floors[j].cableLog;
    
    y = getMaxY(j);

    index = getFirstFireDeviceIndex(cableLog);
    if(index){
      drawDevice(cableLog, cableLog[index].finish_id, cableLog[index].start_id, x, y, index);
    }
    var n = 1;
    index = getNextFireDeviceIndex(cableLog, n);
    while(index){
      y = getMaxY();
      xStep = Math.abs(xStep);
      drawDevice(cableLog, cableLog[index].finish_id, cableLog[index].start_id, x, y, index);
      index = getNextFireDeviceIndex(cableLog, n++);
    }
      
    y = getMaxY();
    for(var i in cableLog){
      xStep = Math.abs(xStep);
      if(cableLog[i].finish_sysname != 'fireDevice'){
          drawElement2(cableLog, cableLog[i].finish_id, cableLog[i].start_id, x , y, i);
      } 
    }
    
  }
}

function drawDevice(cableLog, source_id, target_id, x, y, index){
      var cableLog = cableLog;
      var x = x;
      var y = y;
      var index = index;
      var source_id = source_id;
      var target_id = target_id;
    
    
    //отрисовка fireDevice
      
      //прорисовываем прибор
      if ( typeof graph.getCell(source_id) == 'undefined'){
        
        var point = getNewCoord(x,y, true);
        y = point.y; //вычисление свободной y-ячейки
        x = point.x;
        
        var name = cableLog[index].finish_sysname;
        var marking = cableLog[index].finish_marking[0];
        var text_location = 'left';
        //добавление элемента
        var FD = NewEl(x, y ,widthEl, heightEl, markupArray[name], marking ? marking : name, text_location, null, 'green')
        FD.set('id', source_id);
        graph.addCell([FD]);
        
      }

      //прорисовываем таргет прибора
      if ( typeof graph.getCell(target_id) == 'undefined'){
        
        
        var point = getNewCoord(x,y);
        y = point.y; //вычисление свободной y-ячейки
        x = point.x;
//        var coor = "x:"+x+" y:"+y;
        var name = cableLog[index].start_sysname;
        var marking = cableLog[index].start_marking[0];
        target_id = cableLog[index].start_id;
        var text_location = 'top';
        //добавление элемента
        var FD = NewEl( x, y, widthEl, heightEl, markupArray[name], marking ? marking : name, text_location, null, 'green')
        FD.set('id', target_id);
        graph.addCell([FD]);
        graph.addCell([getLink(source_id, target_id)]); 
      }
      
      drawElement2(cableLog, source_id, target_id, x, y, index);
}


function getFirstFireDeviceIndex(cableLog){
  var cableLog = cableLog;
  for(var i in cableLog){
    if(cableLog[i].finish_sysname == 'fireDevice'){
      var marking = cableLog[i].start_marking[0];
      var number = marking ? marking.split('.')[0] : 0 ;
      if(1 == number || ''){
        return i;
      }
    }
  } 
  return false;
}

function getNextFireDeviceIndex(cableLog, number){
  var cableLog = cableLog;
  var number = number;
  for(var i in cableLog){
    if(cableLog[i].finish_sysname == 'fireDevice'){
      var marking = cableLog[i].start_marking[0];
      var new_number = marking ? marking.split('.')[0] : 0 ;
      if((number + 1) == new_number){
        return i;
      }
    }
  }
  return false;
}

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
function getNewCoord(x,y,start){
  var x = x;
  var y = y;
  var start = start;

  if(!start){

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






function drawO(scheme){
  try{
  var scheme = scheme;
  var cableLog =[];
  var index;
  var device = {};
  for(var j in floors){
    cableLog = floors[j].cableLog;
    
    y = getMaxY(j);

    device = getFirstDevice(cableLog, scheme);
    if(device.index){
      drawDevice2(cableLog, device, x, y);
    }

    device = getNextDevice(cableLog, 1, scheme);
    while(device){
      y = getMaxY();
      xStep = Math.abs(xStep);
      drawDevice2(cableLog, device, x, y);
      device = getNextDevice(cableLog, +device.number, scheme);
    }
    

      
      var devices = getDevices(cableLog, scheme);
//
    for(var i in devices){
       drawDevice2(cableLog, devices[i], x, y);
//       y = getMaxY();
//      xStep = Math.abs(xStep);
//      device = getNextDevice(cableLog, false, scheme);
//      drawDevice2(cableLog, device, x, y);
//      
      
//      xStep = Math.abs(xStep);
//      if(cableLog[i].finish_sysname != scheme ){
          
//          
//            drawElement2(cableLog, cableLog[i].finish_id, cableLog[i].start_id, x , getMaxY(), i,0,false);
////         
//            drawElement2(cableLog, cableLog[i].start_id, cableLog[i].finish_id, x , getMaxY(), i,0,false);

//          if( typeof graph.getCell(cableLog[i].start_id) == 'undefined'){
//            y = getMaxY();
//            drawElement2(cableLog, cableLog[i].start_id, cableLog[i].finish_id, x , y, i,0,false);
//            drawElement2(cableLog, cableLog[i].finish_id,cableLog[i].start_id, x , y, i,0,false);
//          }
//      } 
//      
//      
//      
//      
//      
    }

  }
  }
  catch(err){
    alert(err);
  }
}

function getFirstDevice(cableLog, deviceName){      
  var cableLog = cableLog;
  var deviceName = deviceName;
  var device = {};
  
  var obj = {};
  obj.name = deviceName;
  obj.source = {};
  obj.target = {};
  
  
  for(var i in cableLog){

      obj.source.id = cableLog[i].finish_id;
      obj.source.name = cableLog[i].finish_sysname;
      obj.source.marking = cableLog[i].finish_marking[0];
      obj.index = i;
      obj.target.id = cableLog[i].start_id;
      obj.target.name = cableLog[i].start_sysname;
      obj.target.marking = cableLog[i].start_marking[0];
      
    if(cableLog[i].finish_sysname == deviceName && 
      cableLog[i].full_path[cableLog[i].full_path.length-1].elem_type == elem_types[deviceName]){
      
        device = obj;
        device.number = obj.target.marking !='' ? obj.target.marking.split('.')[0] : '' ;
        if(1 == device.number || '' == device.number){
          return device;
        }
    }
    
    if(cableLog[i].start_sysname == deviceName && 
      cableLog[i].full_path[0].elem_type == elem_types[deviceName]){
      
        device.target = obj.source;
        device.source = obj.target;
        device.index = obj.index;
        device.number = obj.target.marking !='' ? obj.target.marking.split('.')[0] : '' ;

        if(1 == device.number || '' == device.number){
          return device;
        }
    }    
  } 
  return false;
}


function getNextDevice(cableLog, number, deviceName){
  var cableLog = cableLog;
  var deviceName = deviceName;
  var device = {};

  var obj = {};
  obj.name = deviceName;
  obj.source = {};
  obj.target = {};
  
  var cableLog = cableLog;
  var number = number;
  
  
  for(var i in cableLog){

      obj.source.id = cableLog[i].finish_id;
      obj.source.name = cableLog[i].finish_sysname;
      obj.source.marking = cableLog[i].start_marking[0];
      obj.index = i;
      obj.target.id = cableLog[i].start_id;
      obj.target.name = cableLog[i].start_sysname;
      obj.target.marking = cableLog[i].start_marking[0];
      
    if(cableLog[i].finish_sysname == deviceName && 
      cableLog[i].full_path[cableLog[i].full_path.length-1].elem_type == elem_types[deviceName]){
      
//        if(device.number == false){return device};
        
        device = obj;
        device.number = obj.target.marking !='' ? obj.target.marking.split('.')[0] : '' ;
        if( device.number == (number+1)){
          return device;
        }
    }
    
    if(cableLog[i].start_sysname == deviceName && 
      cableLog[i].full_path[0].elem_type == elem_types[deviceName]){
      
        device.target = obj.source;
        device.source = obj.target;
        device.index = obj.index;
        device.number = obj.target.marking !='' ? obj.target.marking.split('.')[0] : '' ;

//        if(device.number == false){return device}; 
        
        if( device.number == (number+1)){
          return device;
        }
    }    
  } 
  return false;
}

function getDevices(cableLog, deviceName){
  var devices = [];
  var cableLog = cableLog;
  var deviceName = deviceName;
  var device = {};

  var obj = {};
  obj.name = deviceName;
  obj.source = {};
  obj.target = {};
  
  var cableLog = cableLog;
  var number = number;
  
  
  for(var i in cableLog){

      obj.source.id = cableLog[i].finish_id;
      obj.source.name = cableLog[i].finish_sysname;
      obj.source.marking = cableLog[i].start_marking[0];
      obj.index = i;
      obj.target.id = cableLog[i].start_id;
      obj.target.name = cableLog[i].start_sysname;
      obj.target.marking = cableLog[i].start_marking[0];
      
    if(cableLog[i].finish_sysname == deviceName && 
      cableLog[i].full_path[cableLog[i].full_path.length-1].elem_type == elem_types[deviceName]){
      
//        if(device.number == false){return device};
        
        device = obj;
        device.number = obj.target.marking !='' ? obj.target.marking.split('.')[0] : '' ;
        if( obj.target.marking ==''){
          devices.push(device);
        }
    }
    
    if(cableLog[i].start_sysname == deviceName && 
      cableLog[i].full_path[0].elem_type == elem_types[deviceName]){
      
        device.target = obj.source;
        device.source = obj.target;
        device.index = obj.index;
        device.number = obj.target.marking !='' ? obj.target.marking.split('.')[0] : '' ;

//        if(device.number == false){return device}; 
        
        if( obj.target.marking ==''){
          devices.push(device);
        }
    }    
  } 
  return devices;
}


//Отрисовка элементов
function drawElement2(cableLog, source_id, target_id, x, y, index, number, is_device){
  var cableLog = cableLog;
  var x = x;
  var y = y;
  var index = index;
  var source_id = source_id;
  var target_id = target_id;
  var number = number || '';
  var is_device = is_device || true;
  var start_id;
  var finish_id;
  //проход по каталогу cableLog
  for(var i in cableLog){
      //исключаем  индекс элемента 
    if( i != index){
      finish_number = cableLog[i].finish_marking[0];
      start_number = cableLog[i].start_marking[0];
      start_id = cableLog[i].start_id;
      start_number = start_number !='' ? start_number.split('.')[0] : '' ;
      finish_id = cableLog[i].finish_id;
      finish_number = finish_number !='' ? finish_number.split('.')[0] : '' ;
//       
      if(finish_id == target_id || start_id == target_id  || !is_device){

        var text_location = (name == 'fireDevice') ? 'left' : 'top';

        if( finish_id == target_id ){
          var new_target_id = cableLog[i].start_id;
          var new_elem_sysname = cableLog[i].start_sysname;
          var new_marking = cableLog[i].start_marking[0];

          var elem_sysname = cableLog[i].finish_sysname;
          var marking = cableLog[i].finish_marking[0];

        } else if(start_id == target_id){
          var new_target_id = cableLog[i].finish_id;
          var new_elem_sysname = cableLog[i].finish_sysname;
          var new_marking = cableLog[i].finish_marking[0];

          var elem_sysname = cableLog[i].start_sysname;
          var marking = cableLog[i].start_marking[0];
        } 
        
        
        if(number == marking.split('.')[0] || !is_device){
          if ( typeof graph.getCell(new_target_id) == 'undefined'){
            
            var point = getNewCoord(x,y);//вычисление свободной y-ячейки
            x = point.x;
            y = point.y;
  //            var coor = "x:"+x+" y:"+y;  
  //          добавление элемента
            var IZ = NewEl(x,y,widthEl,heightEl,markupArray[new_elem_sysname], i,'top', null, 'green')
            IZ.set('id', new_target_id);
            graph.addCell([IZ]);
  //          добавление элемента

            source_id = target_id
  //          добавление линки между элементами
            graph.addCell([getLink(source_id, new_target_id)]); 
  //           добавление линки между элементами
          }  
        
       
          drawElement2(cableLog, source_id,new_target_id, x,y,i,number, is_device);
       
        }
  
      }    
    }
  }              
}

function drawDevice2(cableLog, device, x, y){
      var cableLog = cableLog;
      var x = x;
      var y = y;
      var index = index;
      var device = device;
      var point = {};
      
      //прорисовываем прибор
      if ( typeof graph.getCell(device.source.id) == 'undefined'){
        
        point = getNewCoord(x,y, true);//вычисление свободной y-ячейки
        //добавление элемента
        var FD = NewEl(point.x, point.y ,widthEl, heightEl, markupArray[device.source.name], device.source.marking ? device.source.marking : device.source.name, 'left', null, 'green')
        FD.set('id', device.source.id);
        graph.addCell([FD]);
        
      }

      //прорисовываем таргет прибора
      if ( typeof graph.getCell(device.target.id) == 'undefined'){

        point = getNewCoord(x,y);//вычисление свободной y-ячейки
        //добавление элемента
        var FD = NewEl( point.x, point.y, widthEl, heightEl, markupArray[device.target.name], device.target.marking ? device.target.marking : device.target.name, 'top', null, 'green')
        FD.set('id', device.target.id);
        graph.addCell([FD]);
        graph.addCell([getLink(device.source.id, device.target.id)]); 
      }
      

        drawElement2(cableLog, device.source.id, device.target.id, point.x, point.y, index, device.number);

}




$(document).ready(function(e)
{
  $.ajax({
    type: 'POST',
    dataType:'json',
    url: '../data/data_2.json',
    success: function(response){
      var data = response;
      floors = data.floors;
      drawO('fireDevice');
    }
	});
});