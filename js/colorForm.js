function colorFormCreate(elementColor, callback){

  var colorWindowElement;
  //window properties
  var width = 300;
  var height = 100;
  var left = ($(window).width() - width)/2;
  var right = ($(window).height() - height)/2;

  colorWindow = new dhtmlXWindows();
  //			colorWindow.attachViewportTo("winVP");
  colorWindowElement = colorWindow.createWindow('colorWindow', left, right, width, height);
  //colorWindow.window('colorWindow').button('close').hide();
//  colorWindow.window('colorWindow').setModal(true);
  colorWindow.attachViewportTo("bd");
  colorWindow.window('colorWindow').keepInViewport(true);
  colorWindowElement.setText("Редактор цвета");

var options = [{'text':'','value':''}];
for (var color in colorCorrespond){
  options.push({
      'text': colorCorrespond[color]
    , 'value': color
    , selected: elementColor == color
  });
}


  var formData = [
          {type: "settings", labelWidth: 90, labelAlign: 'center', inputWidth: 170},
          {type: "combo", note:{text:"Выберите цвет элемента"}, label: "Цвет:", name: "format", options: options},
        ];


  colorForm = colorWindowElement.attachForm();
  colorForm = colorWindowElement.attachForm(formData);
  colorForm.attachEvent("onChange", function (name, value){
      if(value != ''){
        callback.call(this, value);
        colorWindow.window('colorWindow').hide();
      }
       
//       colorWindow.window('colorWindow').close();
  });

}


