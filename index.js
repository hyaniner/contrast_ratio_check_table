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

let LastSelectedIndex = undefined;
let LastSelectedInputType = undefined;
let LastSelectedSubCategory = undefined;
let LastSelectedRowOrCol = undefined;

let DisplayDebugMessage = false;

console.log(`hya`);
main_entry();

function copy_to_clipboard()
{
    let ItemsToCopy = Array();
    for (let HSL of HSLArray)
    {
        let Hex = HslToHex(HSL);
        ItemsToCopy.push(Hex);
    }
    let StringToCopy = ItemsToCopy.join(",");
    navigator.clipboard.writeText(StringToCopy);
    document.querySelector("input.paste_source").value = StringToCopy;
}

function paste_from_clipboard()
{
    let String = document.querySelector("input.paste_source").value;    
    let HexItems = String.split(',');
    let HSLItems = Array();
    for (let HexItem of HexItems)
    {
        
        let HSLItem = HexToHSL(HexItem);
        if(HSLItem == null)
        {
            break;
        }
        HSLItems.push(HSLItem);
    }

    HSLArray.splice(0, HSLArray.length);
    for (let HSLItem of HSLItems)
    {
        HSLArray.push(HSLItem);
    }
    
    ColorManipulatorArray.splice(0, ColorManipulatorArray.length);
    RebuildColorManipulatorArrayFromHSLArray();
    RefreshPage();
}

function RebuildColorManipulatorArrayFromHSLArray()
{
    for (let HSLItem of HSLArray)
    {
        let ItemZeroNode = GetNewColorManipulatorItemNode();
        InitializeNewColorManipulatorItem(ItemZeroNode, ColorManipulatorArray.length, HSLItem);
        ColorManipulatorArray.push(ItemZeroNode);
    }
}

function main_entry()
{
    ReadyHTMLEnvironment();

    let ItemZeroHex = "#000000";
    let ItemZeroHSL = HexToHSL(ItemZeroHex);
    console.log(`main_entry::HSL?:${ItemZeroHSL.h},${ItemZeroHSL.s},${ItemZeroHSL.l}`);
    
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
        let itemToAppend = ManipulatorItem.cloneNode(true);
        SetRowOrCol(itemToAppend, "Row");
        FirstRow.appendChild(itemToAppend);
    }

    let SecondRow = MainContainerChildContainer.appendChild(ResouceRowContainerBase.cloneNode(true));
    let FirstColumnOfTable = SecondRow.appendChild(ResouceColumnContainerBase.cloneNode(true));
    for (let ManipulatorItem of ColorManipulatorArray)
    {
        let itemToAppend = ManipulatorItem.cloneNode(true);
        SetRowOrCol(itemToAppend, "Col");
        FirstColumnOfTable.appendChild(itemToAppend);
    }

    let SecondColumnOfTable = SecondRow.appendChild(ResouceColumnContainerBase.cloneNode(true));
    for(let RowIndex = 0; RowIndex < ColorManipulatorArray.length ; RowIndex++)
    {
        let LastRow = SecondColumnOfTable.appendChild(ResouceRowContainerBase.cloneNode(true));
        for(let ColIndex = 0; ColIndex < ColorManipulatorArray.length ; ColIndex++)
        {
            let ItemToAdd = ResouceItemContainerBase.cloneNode(true);
            let Inner = ItemToAdd.querySelector("div.item_container_inner");
            
            let BackgroundColorRGB = hslToRGB(HSLArray[RowIndex]);            
            let BackgroundColorHex = RGBToHex(BackgroundColorRGB);

            let ForeColorRGB = hslToRGB(HSLArray[ColIndex]);
            let ForeColorHex = RGBToHex(ForeColorRGB);

            let ContrastRatio = GetContrastRatio(BackgroundColorRGB, ForeColorRGB);

            Inner.textContent = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(ContrastRatio);
            if(ContrastRatio >= 4.5)
            {
                Inner.classList.add("over_threshold");
            }
            else
            {
                Inner.classList.add("under_threshold");
            }
            

            Inner.style.backgroundColor = ForeColorHex;
            //Inner.style.color = invertColor(ForeColorHex, true);
            Inner.style.color = BackgroundColorHex;

            ItemToAdd.style.backgroundColor = BackgroundColorHex;

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
    let ItemZeroHex = "#000000";
    let ItemZeroHSL = HexToHSL(ItemZeroHex);
    let ItemZeroNode = GetNewColorManipulatorItemNode();
    InitializeNewColorManipulatorItem(ItemZeroNode, ColorManipulatorArray.length, ItemZeroHSL);
    ColorManipulatorArray.push(ItemZeroNode);
    HSLArray.push(ItemZeroHSL);

    RefreshPage();
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
    let InputToReplaces = ItemToWork.querySelectorAll("input.hsl_input_text, input.hsl_input_range");
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

function SetRowOrCol(ItemToWork, NewValue)
{
    let ButtonToReplaces = ItemToWork.querySelectorAll("button.hsl_button_add_sub");    
    for (let ButtonToWork of ButtonToReplaces)
    {
        ButtonToWork.dataset.itemRowOrCol = NewValue;
        //ButtonToWork.value = 0;
    }
    let InputToReplaces = ItemToWork.querySelectorAll("input.hsl_input_text, input.hsl_input_range");
    for (let InputToWork of InputToReplaces)
    {
        InputToWork.dataset.itemRowOrCol = NewValue;
        //InputToWork.value = 0;
    }
    let InputRGB = ItemToWork.querySelector("input.input_rgb_text");
    InputRGB.dataset.itemRowOrCol = NewValue;    

    let DeleteButton = ItemToWork.querySelector("button.delete_button");
    DeleteButton.dataset.itemRowOrCol = NewValue;
}

function SetColorMainpulatorItemInputValue(ItemToWork, HSL)
{
    
    let InputRGB = ItemToWork.querySelector("input.input_rgb_text");
    
    console.log(`HSL?:${HSL.h},${HSL.s},${HSL.l}`);

    let AsHex = HslToHex(HSL);
    console.log(`HSL-HexConverted: ${AsHex}`);
    InputRGB.value = AsHex

    let HRounded =  (Math.round(HSL.h * 10))/10;
    let SRounded =  (Math.round(HSL.s * 10))/10;
    let LRounded =  (Math.round(HSL.l * 10))/10;


    ItemToWork.querySelector("input.hsl_input_text.hue_part").value = HRounded;    
    ItemToWork.querySelector("input.hsl_input_range.hue_part").value = HRounded;
    
    ItemToWork.querySelector("input.hsl_input_text.sat_part").value = SRounded;
    ItemToWork.querySelector("input.hsl_input_range.sat_part").value = SRounded;

    ItemToWork.querySelector("input.hsl_input_text.light_part").value = LRounded;
    ItemToWork.querySelector("input.hsl_input_range.light_part").value = LRounded;
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

    let IndexToWork = item.dataset.itemIndex;
    let InputType = item.dataset.inputType;
    let subCategory = item.dataset.subCategory;    
    let RowOrCol = item.dataset.itemRowOrCol;

    LastSelectedIndex = IndexToWork;
    LastSelectedInputType = InputType;
    LastSelectedSubCategory = subCategory ;
    LastSelectedRowOrCol = RowOrCol;

    console.log(`기억: Index: ${IndexToWork} / subCategory: ${subCategory} / InputType:${InputType} / RowOrCol : ${RowOrCol}`);

    let OldHSL = HSLArray[IndexToWork];
    let ColorManipulator = ColorManipulatorArray[IndexToWork];

    if (InputType === "button_delete")
    {
        console.log(`Index ${IndexToWork} button_delete`);
        HSLArray.splice(IndexToWork, 1);
        ColorManipulatorArray.splice(0, ColorManipulatorArray.length);
        RebuildColorManipulatorArrayFromHSLArray();
        RefreshPage();
    }
    else if (InputType === "input_text")
    {
        if (subCategory === "rgb")
        {
            console.log(`Index ${IndexToWork} input_text, rgb`);
            let NewHex = item.value;
            console.log(`NewValue:${NewHex}`);
            let RGBConvertResult = HexToRGBWithValidation(NewHex);
            console.log(`RGBConvertResult: ${RGBConvertResult.Valid}`);
            if(RGBConvertResult.Valid !== true)
            {
                OldRGB = ColorManipulator.querySelector("input.input_rgb_text").value;
                item.value = OldRGB;
                console.log(`안돼여긴`);
            }
            else
            {
                let NewHSL = rgbToHSL(RGBConvertResult.RGB);
                console.log(`NewHex ${NewHex} asRGB: ${RGBConvertResult.RGB.r},${RGBConvertResult.RGB.g},${RGBConvertResult.RGB.b} asHSL:${NewHSL.h},${NewHSL.s},${NewHSL.l}`);

                ModifyColorManipulatorAndHLSArrayAndRefreash(IndexToWork, NewHSL);
            }
        }
        else 
        {
            let NewHSL = undefined;
            let RangeOverflowed = false;

            let asNum = Number.parseInt(item.value, 10);            
            let IsInt = !(Number.isNaN(asNum));
            console.log(`asnum : ${asNum} and IsInt:${IsInt}`);
            if(IsInt)
            {
                if (subCategory === "h")
                {
                    console.log(`Index ${IndexToWork} input_text, h`);
                    let NewH = asNum;
                    if(NewH > 360 || NewH < 0)
                    {
                        NewH = (((Math.round(NewH) % 360) + 360) % 360);
                    }
                    NewHSL = { h: NewH, s:OldHSL.s, l:OldHSL.l };
                    console.log(`NewH:${NewH}`);
                }
                else if (subCategory === "s")
                {
                    console.log(`Index ${IndexToWork} input_text, s`);
                    let NewS = asNum;
                    if(NewS > 100 || NewS < 0)
                    {
                        RangeOverflowed = true;
                    }
                    else
                    {
                        NewHSL = { h: OldHSL.h, s:NewS, l:OldHSL.l };
                    }
                }
                else if (subCategory === "l")
                {
                    console.log(`Index ${IndexToWork} input_text, l`);
                    let NewL = asNum;
                    if(NewL > 100 || NewL < 0)
                    {
                        RangeOverflowed = true;
                    }
                    else
                    {
                        NewHSL = { h: OldHSL.h, s:OldHSL.s, l:NewL };
                    }
                }
            }

            if(RangeOverflowed === false && IsInt)
            {
                ModifyColorManipulatorAndHLSArrayAndRefreash(IndexToWork, NewHSL);
            }
            else
            {
                if (subCategory === "h")
                {
                    item.value = OldHSL.h;
                }
                else if (subCategory === "s")
                {
                    item.value = OldHSL.s;
                }
                else if (subCategory === "l")
                {
                    item.value = OldHSL.l;
                }
            }
            
        }
        
    }
    else if (InputType === "button_add" || InputType === "button_sub")
    {
        let NewHSL = undefined;
        let RangeOverflowed = false;
        if (subCategory === "h")
        {
            console.log(`Index ${IndexToWork} button_add/sub, h`);
            let NewH = undefined;
            if(InputType === "button_add")
            {
                NewH = OldHSL.h + 1;
            }
            else
            {
                NewH = OldHSL.h - 1;
            }
            
            if(NewH > 360 || NewH < 0)
            {
                NewH = (((Math.round(NewH) % 360) + 360) % 360);
            }            
            NewHSL = { h: NewH, s:OldHSL.s, l:OldHSL.l };
            
        }
        else if (subCategory === "s")
        {
            console.log(`Index ${IndexToWork} button_add/sub, s`);
            let NewS = undefined;
            if(InputType === "button_add")
            {
                NewS = OldHSL.s + 1;
            }
            else
            {
                NewS = OldHSL.s - 1;
            }
            
            if(NewS > 100 || NewS < 0)
            {
                RangeOverflowed = true;
            }
            else
            {
                NewHSL = { h: OldHSL.h, s:NewS, l:OldHSL.l };
            }
            
        }
        else if (subCategory === "l")
        {
            console.log(`Index ${IndexToWork} button_add/sub, l`);
            let NewL = undefined;
            if(InputType === "button_add")
            {
                NewL = OldHSL.l + 1;
            }
            else
            {
                NewL = OldHSL.l - 1;
            }

            if(NewL > 100 || NewL < 0)
            {
                RangeOverflowed = true;
            }
            else
            {
                NewHSL = { h: OldHSL.h, s:OldHSL.s, l:NewL };
            }
            
        }

        if(RangeOverflowed === false)
        {
            NewHSL = normalizeHSL(NewHSL);
            ModifyColorManipulatorAndHLSArrayAndRefreash(IndexToWork, NewHSL);
        }
    }
    else if (InputType === "input_range")
    {
        let NewHSL = undefined;
        if (subCategory === "h")
        {
            console.log(`Index ${IndexToWork} input_range, h`);
            let NewH = item.value;
            NewHSL = { h: NewH, s:OldHSL.s, l:OldHSL.l };
        }
        else if (subCategory === "s")
        {
            console.log(`Index ${IndexToWork} input_range, s`);
            let NewS = item.value;
            NewHSL = { h: OldHSL.h, s:NewS, l:OldHSL.l };
        }
        else if (subCategory === "l")
        {
            console.log(`Index ${IndexToWork} input_range, l`);
            let NewL = item.value;
            NewHSL = { h: OldHSL.h, s:OldHSL.s, l:NewL };
        }
        NewHSL = normalizeHSL(NewHSL);
        ModifyColorManipulatorAndHLSArrayAndRefreash(IndexToWork, NewHSL);
    }
}

function ModifyColorManipulatorAndHLSArrayAndRefreash(Index, NewHSL)
{
    let ColorManipulator = ColorManipulatorArray[Index];

    HSLArray.splice(Index, 1, NewHSL);
    SetColorMainpulatorItemInputValue(ColorManipulator, NewHSL);
    ApplyColorToColorManipulator(ColorManipulator, NewHSL);
    RefreshPage();

    let ColorManipulatorItems = document.querySelectorAll("div.color_manipulate_item");
    console.log(`들어오나요 ${ColorManipulatorItems.length}`);
    for (let ColorManipulatorItem of ColorManipulatorItems)
    {
        let Found = false;
        let  controlElements = ColorManipulatorItem.querySelectorAll("input.control_element, button.control_element");
        console.log(`들어오나요 서브 ${controlElements.length}`);
        for(let item of controlElements)
        {
            let IndexToWork = item.dataset.itemIndex;
            let InputType = item.dataset.inputType;
            let subCategory = item.dataset.subCategory;    
            let RowOrCol = item.dataset.itemRowOrCol;

            console.log(`확인: Index: ${IndexToWork} / subCategory: ${subCategory} / InputType:${InputType} / RowOrCol : ${RowOrCol}`);

            if(
                item.dataset.itemIndex == LastSelectedIndex
                && item.dataset.inputType == LastSelectedInputType
                && item.dataset.subCategory == LastSelectedSubCategory
                && item.dataset.itemRowOrCol == LastSelectedRowOrCol
            )
            {
                Found = true;
                item.focus();
                console.log(`포커스 성공!`)
                break;
            }
        }
        if(Found === true)
        {
            break;
        }
    }
}

function HexToRGBWithValidation(Hex)
{
    let RGBReulst = hexToRgb(Hex);
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
 * https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion/9493060#9493060
 * 입출력 변경
 */
function rgbToHSL(rgb) {
    
    const r = (rgb.r) / 255;
    const g = (rgb.g) / 255;
    const b = (rgb.b) / 255;
    
    const vmax = Math.max(r, g, b), vmin = Math.min(r, g, b);
    let h, s, l = (vmax + vmin) / 2;
  
    /* 여기도 반환 있어요 */
    if (vmax === vmin) {
        return {
            h: 0*360,
            s: 0*100,
            l: l*100
        };
    }
  

    const d = vmax - vmin;
    s = l > 0.5 ? d / (2 - vmax - vmin) : d / (vmax + vmin);
    if (vmax === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (vmax === g) h = (b - r) / d + 2;
    if (vmax === b) h = (r - g) / d + 4;
    h /= 6;

    
  
    let HSLResult = {
        h: h*360,
        s: s*100,
        l: l*100
    };

    console.log(`hslBeforeNormalize: ${HSLResult.h}, ${HSLResult.s}, ${HSLResult.l}`);
    return HSLResult;
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

    let rPart = Math.round(255 * f(0));
    let gPart = Math.round(255 * f(8));
    let bPart = Math.round(255 * f(4));

    if(rPart > 255)
    {
        rPart = 255;
    }

    if(gPart > 255)
    {
        gPart = 255;
    }

    if(bPart > 255)
    {
        bPart = 255;
    }

    return {
        r: rPart, 
        g: gPart,
        b: bPart
    };
  }

function HexToHSL(Hex)
{
    let RGB = hexToRgb(Hex);
    let HSL = rgbToHSL(RGB);
    console.log(`HexToHSL 내부,HSL:${HSL.h},${HSL.s},${HSL.l} / RGB: ${RGB.r},${RGB.g},${RGB.b} / Hex: ${Hex} `);
    return HSL;
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
    const RGB = hslToRGB(HSL);
    const Hex = RGBToHex(RGB);
    console.log(`HslToHex 내부,HSL:${HSL.h},${HSL.s},${HSL.l} / RGB: ${RGB.r},${RGB.g},${RGB.b} / Hex: ${Hex} `);
    return Hex;
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
        console.log(`Invalid HEX color: ${hex}`);
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

//https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
function luminance(RGB) {
    const r = RGB.r;
    const g = RGB.g
    const b = RGB.b
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

//https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
function GetContrastRatioWithinLuminances(lum1, lum2)
{
    const ratio = lum1 > lum2 
    ? ((lum1 + 0.05) / (lum2 + 0.05))
    : ((lum2 + 0.05) / (lum1 + 0.05));

    return ratio;
}

function GetContrastRatio(FirstRGB, SecondRGB)
{
    const Lum1 = luminance(FirstRGB);
    const Lum2 = luminance(SecondRGB);    
    
    let ResultBeforeRound = GetContrastRatioWithinLuminances(Lum1, Lum2);
    
    let ResultBeforeRoundMultipliedBy100 = ResultBeforeRound * 100;
    let ResultRoundedButStillMultipliedBy100 = Math.round(ResultBeforeRoundMultipliedBy100); 
    let ResultRouned = ResultRoundedButStillMultipliedBy100 / 100;
    return ResultRouned;
}