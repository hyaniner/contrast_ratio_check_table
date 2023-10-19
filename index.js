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

function main_entry()
{
    let ItemToHide = document.querySelector("div.color_test_item");
    let new_node = ItemToHide.cloneNode(true);

    let ChangeTargetValue = 1;
    let ButtonToReplaces = new_node.querySelectorAll("button.hsl_button_add_sub");    
    for (let ButtonToWork of ButtonToReplaces)
    {
        ButtonToWork.dataset.itemIndex = ChangeTargetValue;
    }
    let InputToReplaces = new_node.querySelectorAll("input.hsl_input_text");
    for (let InputToWork of InputToReplaces)
    {
        InputToWork.dataset.itemIndex = ChangeTargetValue;
    }
    let InputRGB = new_node.querySelector("input.input_rgb_text");
    InputRGB.dataset.itemIndex = ChangeTargetValue;

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