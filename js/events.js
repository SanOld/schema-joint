
paper.on('cell:pointerclick ', function(cellView, evt, x, y) { 
  switch (cellView.model.attributes['type']) {
    case 'module':
        
        break; 
    case 'link':  
      colorFormCreate(cellView.model.attr('.connection/stroke'), function(selectedColor){
         cellView.model.attr('.connection', {stroke: selectedColor});
          cellView.model.attr('label/text', {text: selectedColor});
          cellView.model.label(0, {
                attrs: {
                    text: { fill: selectedColor, text: selectedColor }
                }
            });          
      });

      break;
    case 'defs.NewEl':
      colorFormCreate(cellView.model.attr('rect/stroke'), function(selectedColor){
        cellView.model.attr('rect', {stroke: selectedColor});
      });
      break;    

  }


})



