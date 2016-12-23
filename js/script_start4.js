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
function draw(){
  var cableLog =[]
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

//Отрисовка элементов
function drawElement2(cableLog, source_id, target_id, x, y, index){
  var cableLog = cableLog;
  var xStart = x;
  var yStart = y;
  var index = index;
  var source_id = source_id;
  var target_id = target_id;

  //проход по каталогу cableLog
  for(var i in cableLog){
    var x = xStart;
    var y = yStart;
      //исключаем  индекс элемента 
    if( i != index){
      var start_id = null;
      var finish_id = null;
      start_id = cableLog[i].start_id;
      finish_id = cableLog[i].finish_id;
//       
      if(finish_id == target_id || start_id == target_id ){

        var text_location = (name == 'fireDevice') ? 'left' : 'top';

        if(finish_id == target_id){
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

        if ( typeof graph.getCell(new_target_id) == 'undefined'){

          var point = getNewCoord(x,y);
          y = point.y; //вычисление свободной y-ячейки
          x = point.x;
//            var coor = "x:"+x+" y:"+y;  
//          добавление элемента
          var IZ = NewEl(x,y,widthEl,heightEl,markupArray[new_elem_sysname], new_marking ? new_marking : new_elem_sysname,'top', null, 'green')
          IZ.set('id', new_target_id);
          graph.addCell([IZ]);
//          добавление элемента

          source_id = target_id
//          добавление линки между элементами
          graph.addCell([getLink(source_id, new_target_id)]); 
//           добавление линки между элементами
        }  

        drawElement2(cableLog, source_id,new_target_id, x,y,i);

      }    
    }
  }              
}

function getFirstFireDeviceIndex(cableLog){
  var cableLog = cableLog;
  for(var i in cableLog){
    if(cableLog[i].finish_sysname == 'fireDevice'){
      var marking = cableLog[i].start_marking[0];
      var number = marking ? marking.split('.')[0] : 0 ;
      if(1 == number){
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

$(document).ready(function(e)
{
  $.ajax({
    type: 'POST',
    dataType:'json',
    url: '../data/data_2.json',
    success: function(response){
      var data = response;
      floors = data.floors;
      draw();
    }
	});
});