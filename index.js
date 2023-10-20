let ResourceColorManipulatorBase = undefined;
let ResouceColumnContainerBase = undefined;
let ResouceRowContainerBase = undefined;
let ResouceItemContainerBase = undefined;
let ResouceLeftUpCornerSpacerBase = undefined;
let ResouceMainContainerChildBase = undefined;

let MainContainer = undefined;

let LastMainContainerChild = undefined;

let HSLArray = Array();
let ColorManipulatorArray = Array();
let ResultRowArray = Array();

console.log(`hya`);
main_entry();

function main_entry()
{
    ReadyHTMLEnvironment();

    let ItemZeroHex = "#000000";
    let ItemZeroHSL = HexToHSL(ItemZeroHex);
    let ItemZeroNode = GetNewColorManipulatorItemNode();
    InitializeNewColorManipulatorItem(ItemZeroNode, ColorManipulatorArray.length, ItemZeroHSL);
    ColorManipulatorArray.push(ItemZeroNode);
    HSLArray.push(ItemZeroHSL);

    let ItemOneHex = "#ffffff";
    let ItemOneHSL = HexToHSL(ItemOneHex);
    let ItemOneNode = GetNewColorManipulatorItemNode();
    InitializeNewColorManipulatorItem(ItemOneNode, ColorManipulatorArray.length, ItemOneHSL);
    ColorManipulatorArray.push(ItemOneNode);
    HSLArray.push(ItemOneHSL);


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
            let Inner = ItemToAdd.querySelector("div.item_container_inner");
            Inner.textContent = "Row" + RowIndex + "/Col:" + ColIndex;
            
            let BackgroundColor = HslToHex(HSLArray[RowIndex]);
            let ForeColor = HslToHex(HSLArray[ColIndex]);
            
            Inner.style.backgroundColor = ForeColor;
            Inner.style.color = BackgroundColor;

            ItemToAdd.style.backgroundColor = BackgroundColor;
            ItemToAdd.style.color = ForeColor;
            
/*             //SetNodeColor(Inner, BackgroundColor, ForeColor);
            SetNodeColor(ItemToAdd, ForeColor, BackgroundColor); */
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

function InitializeNewColorManipulatorItem(ItemToWork, NewIndex, InitialColorAsHSL)
{
    InitializeNewColorManipulatorItemStructure(ItemToWork, NewIndex);
    SetColorMainpulatorItemInputValue(ItemToWork, InitialColorAsHSL);
    ApplyColorToColorManipulator(ItemToWork, InitialColorAsHSL);
}

function InitializeNewColorManipulatorItemStructure(ItemToWork, NewIndex)
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
}

function SetColorMainpulatorItemInputValue(ItemToWork, HSL)
{
    
    let InputRGB = ItemToWork.querySelector("input.input_rgb_text");
    
    InputRGB.value = HslToHex(HSL);

    ItemToWork.querySelector("input.hsl_input_text.hue_part").value = HSL.h;    
    ItemToWork.querySelector("input.hsl_input_range.hue_part").value = HSL.h;
    
    ItemToWork.querySelector("input.hsl_input_text.sat_part").value = HSL.s;
    ItemToWork.querySelector("input.hsl_input_range.sat_part").value = HSL.s;

    ItemToWork.querySelector("input.hsl_input_text.light_part").value = HSL.l;
    ItemToWork.querySelector("input.hsl_input_range.light_part").value = HSL.l;
}

function ApplyColorToColorManipulator(ItemToWork, HSL)
{
    let AsHex = HslToHex(HSL);
    let InvertedColor = invertColor(AsHex, true);
    SetNodeColor(ItemToWork, InvertedColor, AsHex);
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

    let ItemConainer = document.querySelector("div.item_container.primitive_item");
    ItemConainer.style.width = `${ColorManipulatorWidth}px`;
    ItemConainer.style.height = `${ColorManipulatorHeight}px`;

    ResouceItemContainerBase = ReadHTMLResource("div.item_container.primitive_item");
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

//https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
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
 * 2차 출처: https://www.30secondsofcode.org/js/s/rgb-to-hsl/
 * 1차 출처: https://solo5star.tistory.com/41
 * 입출력을 배열에서 오브젝트로 변경
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
    let hslBeforeNormalize = {
        h: (60 * h < 0 ? 60 * h + 360 : 60 * h),
        s: (100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
        l: ((100 * (2 * l - s)) / 2),
      };

    let hslAfterNormalize = normalizeHSL(hslBeforeNormalize);

    return hslAfterNormalize;
}

/**
 * 1차 출처: https://solo5star.tistory.com/41
 * 입출력을 배열에서 오브젝트로 변경
 */
function normalizeHSL(hsl) {
    const h = hsl.h;
    const s = hsl.s;
    const l = hsl.l;
    return {
        h: (((Math.round(h) % 360) + 360) % 360), // 0 ~ 360, positive modulo
        s: (Math.max(0, Math.min(100, Math.round(s)))), // 0 ~ 100
        l: (Math.max(0, Math.min(100, Math.round(l)))) // 0 ~ 100
    };
  }

/**
 * 2차 출처: https://www.30secondsofcode.org/js/s/hsl-to-rgb/
 * 1차 출처: https://solo5star.tistory.com/41
 * 입출력을 배열에서 오브젝트로 변경 
 */
function hslToRGB(hsl) {
    const h = hsl.h;
    const s = (hsl.s) / 100;
    const l = (hsl.l) / 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
        r: 255 * f(0), 
        g: 255 * f(8),
        b: 255 * f(4)
    };
  }

function HexToHSL(Hex)
{
    return rgbToHSL(hexToRgb(Hex));
}

//https://www.delftstack.com/ko/howto/javascript/rgb-to-hex-javascript/
function ColorToHex(color) {
    var hexadecimal = color.toString(16);
    return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}
  
//https://www.delftstack.com/ko/howto/javascript/rgb-to-hex-javascript/
function ConvertRGBtoHexImpl(red, green, blue) {
    return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
}

function RGBToHex(RGB)
{
    return ConvertRGBtoHexImpl(RGB.r, RGB.g, RGB.b);
}

function HslToHex(HSL)
{
    return RGBToHex(hslToRGB(HSL));
}

//https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

//https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // https://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}