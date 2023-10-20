let ResourceColorManipulatorBase = undefined;
let ResouceColumnContainerBase = undefined;
let ResouceRowContainerBase = undefined;
let ResouceItemContainerBase = undefined;
let ResouceLeftUpCornerSpacerBase = undefined;
let ResouceMainContainerChildBase = undefined;

let MainContainer = undefined;

let LastMainContainerChild = undefined;

let HueArray = Array();
let ColorManipulatorArray = Array();
let ResultRowArray = Array();

console.log(`hya`);
main_entry();

function main_entry()
{
    ReadyHTMLEnvironment();

    let ItemZeroHex = "#000000";
    let ItemZeroNode = GetNewColorManipulatorItemNode();
    let ItemZeroHSL = InitializeNewColorManipulatorItem(ItemZeroNode, ColorManipulatorArray.length, ItemZeroHex);
    ColorManipulatorArray.push(ItemZeroNode);
    HueArray.push(ItemZeroHSL);

    let ItemOneHex = "#ffffff";
    let ItemOneNode = GetNewColorManipulatorItemNode();
    let ItemOneHSL = InitializeNewColorManipulatorItem(ItemOneNode, ColorManipulatorArray.length, ItemOneHex);
    ColorManipulatorArray.push(ItemOneNode);
    HueArray.push(ItemOneHSL);


    RefreshPage();
    

    /* let new_node = ResourceColorManipulatorBase.cloneNode(true);
    InitializeNewItem(new_node, 1);
    let some_value = "#" + "ff" + "2200";
    SetNodeColor(new_node, some_value, "#0000FF");
    document.body.appendChild(new_node); */
}

function RefreshPage()
{
    let NewFragment = document.createDocumentFragment();
    let MainContainerChildContainerSource = ResouceMainContainerChildBase.cloneNode(true);
    let MainContainerChildContainer = NewFragment.appendChild(MainContainerChildContainerSource);
    let FirstRow = MainContainerChildContainer.appendChild(ResouceRowContainerBase.cloneNode(true));
    FirstRow.appendChild(ResouceLeftUpCornerSpacerBase.cloneNode(true));
    for (let ManipulatorItem of ColorManipulatorArray)
    {
        FirstRow.appendChild(ManipulatorItem.cloneNode(true));
    }

    let SecondRow = MainContainerChildContainer.appendChild(ResouceRowContainerBase.cloneNode(true));
    let FirstColumnOfTable = SecondRow.appendChild(ResouceColumnContainerBase.cloneNode(true));
    for (let ManipulatorItem of ColorManipulatorArray)
    {
        FirstColumnOfTable.appendChild(ManipulatorItem.cloneNode(true));
    }

    let SecondColumnOfTable = SecondRow.appendChild(ResouceColumnContainerBase.cloneNode(true));
    for(let RowIndex = 0; RowIndex < ColorManipulatorArray.length ; RowIndex++)
    {
        let LastRow = SecondColumnOfTable.appendChild(ResouceRowContainerBase.cloneNode(true));
        for(let ColIndex = 0; ColIndex < ColorManipulatorArray.length ; ColIndex++)
        {
            let ItemToAdd = ResouceItemContainerBase.cloneNode(true);
            ItemToAdd.textContent = "Row" + RowIndex + "/Col:" + ColIndex;
            LastRow.appendChild(ItemToAdd);
        }
    }

    MainContainer.replaceChild(NewFragment, LastMainContainerChild);
    LastMainContainerChild = MainContainer.querySelector("div.main_container_only_child");    
}

function GetNewColorManipulatorItemNode()
{
    return ResourceColorManipulatorBase.cloneNode(true);
}

function add_item()
{
    console.log(`hya2`);
}

function InitializeNewColorManipulatorItem(ItemToWork, NewIndex, InitialColorAsHex)
{
    let ButtonToReplaces = ItemToWork.querySelectorAll("button.hsl_button_add_sub");    
    for (let ButtonToWork of ButtonToReplaces)
    {
        ButtonToWork.dataset.itemIndex = NewIndex;
        //ButtonToWork.value = 0;
    }
    let InputToReplaces = ItemToWork.querySelectorAll("input.hsl_input_text");
    for (let InputToWork of InputToReplaces)
    {
        InputToWork.dataset.itemIndex = NewIndex;
        //InputToWork.value = 0;
    }
    let InputRGB = ItemToWork.querySelector("input.input_rgb_text");
    InputRGB.dataset.itemIndex = NewIndex;    

    let DeleteButton = ItemToWork.querySelector("button.delete_button");
    DeleteButton.dataset.itemIndex = NewIndex;


    InputRGB.value = InitialColorAsHex;
    let RGBValidationResult = ConvertRGBFromStringToObjectWithValidation(InputRGB.value);

    let RGBPart = RGBValidationResult.RGB;
    let ValidationPart = RGBValidationResult.Valid;
    
    let HSL = undefined;

    if(ValidationPart === true)
    {
        HSL = rgbToHSL(RGBPart);
    }
    else
    {
        console.log(`fail`);
    }

    let InputTextHue = ItemToWork.querySelector("input.hsl_input_text.hue_part");
    InputTextHue.value = HSL.h;
    let InputTextSat = ItemToWork.querySelector("input.hsl_input_text.sat_part");
    InputTextSat.value = HSL.s;
    let InputTextLight = ItemToWork.querySelector("input.hsl_input_text.light_part");
    InputTextLight.value = HSL.l;

    return HSL;
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

function ReadyHTMLEnvironment()
{
    let ColorManipulator = document.querySelector("div.color_manipulate_item.primitive_item");
    let ColorManipulatorWidth = ColorManipulator.getBoundingClientRect().width;
    let ColorManipulatorHeight = ColorManipulator.getBoundingClientRect().height;

    ResourceColorManipulatorBase = ReadHTMLResource("div.color_manipulate_item.primitive_item");
    
    let cornerSource = document.querySelector("div.left_up_corner_spacer.primitive_item");
    cornerSource.style.width = `${ColorManipulatorWidth}px`;

    ResouceLeftUpCornerSpacerBase = ReadHTMLResource("div.left_up_corner_spacer.primitive_item");
    ResouceColumnContainerBase = ReadHTMLResource("div.column_direction_container.primitive_item");
    ResouceRowContainerBase = ReadHTMLResource("div.row_direction_container.primitive_item");

    let ItemConainer = document.querySelector("div.item_conatiner.primitive_item");
    ItemConainer.style.width = `${ColorManipulatorWidth}px`;
    ItemConainer.style.height = `${ColorManipulatorHeight}px`;

    ResouceItemContainerBase = ReadHTMLResource("div.item_conatiner.primitive_item");
    ResouceMainContainerChildBase = ReadHTMLResource("div.main_container_only_child.primitive_item");

    MainContainer = document.getElementById("app_main_container");
    LastMainContainerChild = document.querySelector("div.main_container_only_child.initial_item");
}

function ReadHTMLResource(InSelector)
{
    let Readed = document.querySelector(InSelector);
    let Cloned = Readed.cloneNode(true)
    Cloned.classList.remove("primitive_item");    
    Readed.classList.add("hidden");
    return Cloned;
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