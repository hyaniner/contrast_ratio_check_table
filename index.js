console.log(`hya`);
main_entry();

function add_item()
{
    console.log(`hya2`);
/*     let main_container = document.getElementById("app_main_container");
    let node = document.querySelector("div.color_test_item");
    console.log(`hya3: ${node}`);
    let new_node = node.cloneNode(true);
    main_container.appendChild(new_node); */
}

function InitializeNewItem(itemToWork, newIndex)
{
    let ButtonToReplaces = itemToWork.querySelectorAll("button.hsl_button_add_sub");    
    for (let ButtonToWork of ButtonToReplaces)
    {
        ButtonToWork.dataset.itemIndex = newIndex;
        //ButtonToWork.value = 0;
    }
    let InputToReplaces = itemToWork.querySelectorAll("input.hsl_input_text");
    for (let InputToWork of InputToReplaces)
    {
        InputToWork.dataset.itemIndex = newIndex;
        //InputToWork.value = 0;
    }
    let InputRGB = itemToWork.querySelector("input.input_rgb_text");
    InputRGB.dataset.itemIndex = newIndex;    

    let DeleteButton = itemToWork.querySelector("button.delete_button");
    DeleteButton.dataset.itemIndex = newIndex;


    InputRGB.value = "#ffeecc";
    let RGBValidationResult = ConvertRGBFromStringToObjectWithValidation(InputRGB.value);

    let RGBPart = RGBValidationResult.RGB;
    let ValidationPart = RGBValidationResult.Valid;
    
    let HSL = undefined;

    if(ValidationPart === true)
    {
        HSL = rgbToHSL(RGBPart);
        console.log(`H:${HSL.h}`);
        console.log(`S:${HSL.s}`);
        console.log(`L:${HSL.l}`);
    }
    else
    {
        console.log(`fail`);
    }

    itemToWork.querySelector
    let InputTextHue = itemToWork.querySelector("input.hsl_input_text.hue_part");
    InputTextHue.value = HSL.h;
    let InputTextSat = itemToWork.querySelector("input.hsl_input_text.sat_part");
    InputTextSat.value = HSL.s;
    let InputTextLight = itemToWork.querySelector("input.hsl_input_text.light_part");
    InputTextLight.value = HSL.l;
}



function SetNodeColor(NodeItemToWork, NewColor, NewBackgroundColor)
{
    const ColorVarName = "color:"
    var ColorVarValue = NewColor;
    const BackgroundColorVarName = "background-color:"
    const BackgroundVarValue = NewBackgroundColor
    const styleResult = ColorVarName + ColorVarValue + ";" + BackgroundColorVarName + BackgroundVarValue + ";"
    NodeItemToWork.setAttribute('style', styleResult);
}

function main_entry()
{
    let ItemToHide = document.querySelector("div.color_test_item");
    let new_node = ItemToHide.cloneNode(true);

    InitializeNewItem(new_node, 1);

    let some_value = "#" + "ff" + "2200";

    SetNodeColor(new_node, some_value, "#0000FF");

    document.body.appendChild(new_node);
}

function OnValueChanged(item)
{
    console.log(`${item}`);
    let Index = item.dataset.itemIndex;
    let subCategory = item.dataset.subCategory;
    let InputType = item.dataset.inputType;
    console.log(`Index: ${Index} / subCategory: ${subCategory} / InputType:${InputType}`);
}


function ConvertRGBFromStringToObjectWithValidation(InRGBAsString)
{
    let RGBReulst = hexToRgb(InRGBAsString);
    let ValidResult = undefined;
    if(RGBReulst != null)
    {
        ValidResult = true;        
    }
    else
    {
        ValidResult = false;        
    }

    return {
        Valid: ValidResult,
        RGB: RGBReulst
    }
}

function ReadRGB(InNodeItemToWork, OutRGB)
{
    let RGBAsString = InNodeItemToWork.querySelector("input_rgb_text").value;
    return hexToRgb(RGBAsString);
}

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

/**
 * 출처: https://www.30secondsofcode.org/js/s/rgb-to-hsl/
 * 
 * @param {[number, number, number]} rgb R, G, B 값 배열
 * @returns {[number, number, number]} H, S, L 값 배열
 */
function rgbToHSL(rgb) {
    console.log(`rgb is ok?${rgb}`);
    const r = (rgb.r) / 255;
    const g = (rgb.g) / 255;
    const b = (rgb.b) / 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
  
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return {
      h: (60 * h < 0 ? 60 * h + 360 : 60 * h),
      s: (100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
      l: ((100 * (2 * l - s)) / 2),
    };
  }