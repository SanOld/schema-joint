var currentContextCellView = false;

contextMenu = new dhtmlXMenuObject({
  parent: "contextZone_A",
  context: true
});
contextMenu.addNewChild(contextMenu.topId, 0, "color", "Изменить цвет", false, "");
contextMenu.addNewChild(contextMenu.topId, 1, "apply", "Применить ко всем", false, "");


paper.on('cell:contextmenu', function(cellView, evt, x, y) { 
  
  currentContextCellView = cellView;
  
  switch (cellView.model.attributes['type']) {
    case 'module':
      contextMenu.showItem('color');
      contextMenu.showItem('apply');
      contextMenu.showContextMenu(x,y);
      break;  
    case 'link':
      contextMenu.showItem('color');
      contextMenu.hideItem('apply');
      contextMenu.showContextMenu(x,y);
      break;
    case 'defs.NewEl':
      contextMenu.showItem('color');
      contextMenu.hideItem('apply');
      contextMenu.showContextMenu(x,y);
      break;
    
  }
})







contextMenu.attachEvent("onClick", function(id, zoneId, cas){
switch (currentContextCellView.model.attributes['type']) {
    case 'module':
      if(id == 'color'){
        colorFormCreate(currentContextCellView.model.attr('rect/stroke'), function(selectedColor){
          currentContextCellView.model.attr('rect', {stroke: selectedColor});
        });
      }
      if(id == 'apply'){
        repaint(currentContextCellView.model);
      }
      break;
    case 'link':
      colorFormCreate(currentContextCellView.model.attr('.connection/stroke'), function(selectedColor){
         currentContextCellView.model.attr('.connection', {stroke: selectedColor});
          currentContextCellView.model.attr('label/text', {text: selectedColor});
          currentContextCellView.model.label(0, {
                attrs: {
                    text: { fill: selectedColor, text: selectedColor }
                }
            });
         });
      break;
    case 'defs.NewEl':
      colorFormCreate(currentContextCellView.model.attr('rect/stroke'), function(selectedColor){
          currentContextCellView.model.attr('rect', {stroke: selectedColor});
        });
      break;
  }
 
  
});

//перекрашиваем модули и линки по образцу
function repaint(example){
  var exampleModule = example;
  var elements = graph.getElements();
  var modules = [];
  var color = exampleModule.attr('rect/stroke');
  var linksColor = [];
  var links = graph.getConnectedLinks(exampleModule);
        for(var k in links){
          linksColor.push(links[k].attr('.connection/stroke')) ;
        }
        
  for(var i in elements){
    if(elements[i].prop('type') == 'module' && elements[i].prop('moduleType') == exampleModule.prop('moduleType')){
      //изменение цвета модуля
      elements[i].attr('rect/stroke',  color);
      //изменение цвета линки по образцу
      var links = graph.getConnectedLinks(elements[i]);
        for(var k in links){
          links[k].attr('.connection/stroke', linksColor[k]);
          links[k].label(0, {
                attrs: {
                    text: { fill: linksColor[k], text: linksColor[k] }
                }
            });          
        }
    }
  }
  
}
