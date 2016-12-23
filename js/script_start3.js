var floors = [];//массив элементов по этажам
var yStep = 100; //шаг отрисовки по x
var xStep = 60; //шаг отрисовки по y
var y=100;        //начальное положение первого элемента по x
var x=100;        //начальное положение первого элемента по н
var populationArr =[] // матрица отслеживания расположения элементов
var widthEl = 25; //ширина элемента
var heightEl = 25; //высота элемента

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 3000,
    height: 1500,
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
//        label: {
//            position: {
//                name: 'top',
//                args: {
//                  y: 30,
//                  x: 30
//                }
//            },
//            markup: '<text class="label-text" fill="blue"/>'
//        },
        attrs: { 
//          text: { text: 'port1' },
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
  
// var IOEAO =  $('#IOEAO').html().replace(/(\r\n|\n|\r|\t)/gm,"");
// var IOEPL =  $('#IOEPL').html().replace(/(\r\n|\n|\r|\t)/gm,"");; 
// var IPUFP =  $('#IPUFP').html().replace(/(\r\n|\n|\r|\t)/gm,"");; 
// var PPKP =  $('#PPKP').html().replace(/(\r\n|\n|\r|\t)/gm,"");; 
//
//
// //params x, y, width, height, markup, text, text_location, text_color, rect_color
//var IOEAO_View = NewEl(100,100,50,50,IOEAO, 'qqq','top');
//var IOEPL_View = NewEl(250,100,50,50,IOEPL, 'www','top');
//var IPUFP_View = NewEl(400,100,50,50,IPUFP, 'eee','top');
//var PPKP_View = NewEl(550,100,50,50,PPKP, 'ttt','top');
//
//var link = new joint.dia.Link({
//    source: { id: IOEAO_View.id },
//    target: { id: IOEPL_View.id }
//});
//var link2 = new joint.dia.Link({
//    source: { id: IOEPL_View.id },
//    target: { id: IPUFP_View.id }
//});
//var link3 = new joint.dia.Link({
//    source: { id: IPUFP_View.id },
//    target: { id: PPKP_View.id }
//})
//
//
//graph.addCells([IOEAO_View, IOEPL_View,IPUFP_View, PPKP_View, link, link2, link3]);
//
////===================================
//var IOEAO_View2 = NewEl(100,200,100,100,IOEAO, 'qqq','left');
//var IOEPL_View2 = NewEl(250,200,50,50,IOEPL, 'www','bottom');
//var IPUFP_View2 = NewEl(400,200,50,50,IPUFP, 'eee','top');
//var PPKP_View2 = NewEl(550,200,100,100,PPKP, 'ttt','right');
//
//var link12 = new joint.dia.Link({
//    source: { id: IOEAO_View2.id },
//    target: { id: IOEPL_View2.id }
//});
//var link22 = new joint.dia.Link({
//    source: { id: IOEPL_View2.id },
//    target: { id: IPUFP_View2.id }
//});
//var link32 = new joint.dia.Link({
//    source: { id: IPUFP_View2.id },
//    target: { id: PPKP_View2.id }
//})
//
//
//graph.addCells([IOEAO_View2, IOEPL_View2,IPUFP_View2, PPKP_View2, link12, link22, link32]);

//===================================================

markupArray = [];
markupArray['fireAlarm'] =  $('#fireAlarm').html().replace(/(\r\n|\n|\r|\t)/gm,"");
markupArray['pullStation'] =  $('#pullStation').html().replace(/(\r\n|\n|\r|\t)/gm,"");; 
markupArray['fireEndDevice'] =  $('#fireEndDevice').html().replace(/(\r\n|\n|\r|\t)/gm,"");; 
markupArray['fireSiren'] =  $('#fireSiren').html().replace(/(\r\n|\n|\r|\t)/gm,"");; 
 
$(document).ready(function(e)
{
  $.ajax({
    type: 'POST',
    dataType:'json',
    url: '../data/data_1.json',
    success: function(response){
      var data = response;
      floors = data.floors;
      draw();
    }
	});
});

//Отрисовка элементов
function draw(){
  var cableLog =[]
  var index;
  for(var j in floors){
    cableLog = floors[j].cableLog;
    
    y = populationArr.length ?  populationArr[x].length-1+xStep : y;
    for(var i in cableLog){
      if(cableLog[i].finish_sysname == 'fireDevice'){
          drawElement(cableLog, cableLog[i].finish_id,x,y,i);
      } 
    }
//      index = getFirstFireDeviceIndex(cableLog);
//      if(index){
//        drawElement2(cableLog, cableLog[index].finish_id,cableLog[index].start_id, x,y,index);
//      }
//      var n = 1;
//      index = getNextFireDeviceIndex(cableLog, n);
//      while(index){
//        drawElement2(cableLog, cableLog[index].finish_id,cableLog[index].start_id,x,y,index);
//        index = getNextFireDeviceIndex(cableLog, n++);
//      }
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

//Отрисовка элементов
function drawElement(cableLog, source_id, x, y, index){
      var cableLog = cableLog;
      var xStart = x;
      var yStart = y;
      var index = index;
    //проход по каталогу cableLog
    for(var i in cableLog){
        var x = xStart;
        var y = yStart;
      //исключаем проверку индекса элемента  
      if(i != index){
        var start_id = null;
        var finish_id = null;
        start_id = cableLog[i].full_path[0].elem_id;
        finish_id = cableLog[i].full_path[cableLog[i].full_path.length-1].elem_id;
//       
        if(finish_id == source_id || start_id == source_id ){
          
          if(finish_id == source_id){
            var name = cableLog[i].finish_sysname;
            var marking = cableLog[i].finish_marking[0];
          } else {
            var name = cableLog[i].start_sysname;
            var marking = cableLog[i].start_marking[0];
          }
          
          var text_location = (name == 'fireDevice') ? 'left' : 'top';

         //вычисление свободной y-ячейки
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
          populationArr[x][y] = 1;//значение в ячейке - занята
          //вычисление свободной y-ячейки

          //добавление элемента
          var FD = NewEl(x,y,widthEl,heightEl,markupArray[name], marking ? marking : name, text_location, null, 'green')
          FD.set('id', source_id);
          graph.addCell([FD]);
          x = x + xStep;


          if(finish_id == source_id){
            var id = cableLog[i].full_path[0].elem_id;
            var elem_sysname = cableLog[i].full_path[0].elem_sysname;
            var marking = cableLog[i].start_marking[0];
          } else {
            var id = cableLog[i].full_path[cableLog[i].full_path.length-1].elem_id;
            var elem_sysname = cableLog[i].full_path[cableLog[i].full_path.length-1].elem_sysname;
          } 

          if ( typeof graph.getCell(id) == 'undefined'){
             //добавление элемента
            var IZ = NewEl(x,y,widthEl,heightEl,markupArray[elem_sysname], marking ? marking : elem_sysname,'top', null, 'green')
            IZ.set('id', id);
            var target_id = IZ.id;
            graph.addCell([IZ]);
//                  x = x + xStep;

            //добавление линки между элементами
            var link1 = new joint.dia.Link({
               source: { id: source_id, port: 'abc'  },
               target: { id: target_id, port: 'abc' },
               attrs:{
                 manhattan:true //ортогональное расположение
               }
            });

            link1.set('router', {
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

            link1.set('connector', { name: 'normal' });

            graph.addCell([link1]); 
          }

          if(elem_sysname != 'fireEndDevice'){
            drawElement(cableLog,target_id,x,y,i);
          }
        }
      }
    } 
}



//Отрисовка элементов
function drawElement2(cableLog, source_id, target_id, x, y, index){
      var cableLog = cableLog;
      var xStart = x;
      var yStart = y;
      var index = index;
      var source_id = source_id;
      var target_id = target_id;
    
    
    //отрисовка fireDevice
    if(cableLog[index].finish_sysname == 'fireDevice'){
      if ( typeof graph.getCell(source_id) == 'undefined'){
        var name = cableLog[index].finish_sysname;
        var marking = cableLog[index].finish_marking[0];
        var text_location = 'left';
        //добавление элемента
        var FD = NewEl(x,y,widthEl,heightEl,markupArray[name], marking ? marking : name, text_location, null, 'green')
        FD.set('id', source_id);
        graph.addCell([FD]);
      }
      xStart = xStart + xStep;
    }
    
    
    
    //проход по каталогу cableLog
    for(var i in cableLog){
        var x = xStart;
        var y = yStart;
      //исключаем проверку индекса элемента  
      if(i != index){
        var start_id = null;
        var finish_id = null;
        start_id = cableLog[i].full_path[0].elem_id;
        finish_id = cableLog[i].full_path[cableLog[i].full_path.length-1].elem_id;
//       
        if(finish_id == target_id || start_id == target_id ){
          
          var text_location = (name == 'fireDevice') ? 'left' : 'top';

//          вычисление свободной y-ячейки
          if(finish_id == target_id){
            var new_target = cableLog[i].full_path[0].elem_id;
            var new_elem_sysname = cableLog[i].full_path[0].elem_sysname;
            
            var elem_sysname = cableLog[i].full_path[cableLog[i].full_path.length-1].elem_sysname;
            var marking = cableLog[i].finish_marking[0];
            
          } else if(start_id == target_id){
            var new_target = cableLog[i].full_path[cableLog[i].full_path.length-1].elem_id;
            var new_elem_sysname = cableLog[i].full_path[cableLog[i].full_path.length-1].elem_sysname;

            var elem_sysname = cableLog[i].full_path[0].elem_sysname;
            var marking = cableLog[i].start_marking[0];
          } else {
            continue;
          }

          if ( typeof graph.getCell(target_id) == 'undefined'){
//          вычисление свободной y-ячейки
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
          populationArr[x][y] = 1;//значение в ячейке - занята
//          вычисление свободной y-ячейки
//          добавление элемента
            var IZ = NewEl(x,y,widthEl,heightEl,markupArray[elem_sysname], marking ? marking : elem_sysname,'top', null, 'green')
            IZ.set('id', target_id);
            var target_id = IZ.id;
            graph.addCell([IZ]);
            x = x + xStep;
//          добавление элемента

//          добавление линки между элементами
            var link1 = new joint.dia.Link({
               source: { id: source_id, port: 'abc'  },
               target: { id: target_id, port: 'abc' },
               attrs:{
                 manhattan:true //ортогональное расположение
               }
            });
            link1.set('router', {
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
            link1.set('connector', { name: 'normal' });
            graph.addCell([link1]); 
            //добавление линки между элементами
          }

          if(new_elem_sysname != 'fireEndDevice'){
            drawElement2(cableLog,target_id,new_target, x,y,i);
          }
        }
      }
    } 
}

