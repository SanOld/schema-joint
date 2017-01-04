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
        alert("сделать");
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
