console.log(`hya`);

function add_item()
{
    console.log(`hya2`);
    let main_container = document.getElementById("app_main_container");
    let node = document.querySelector("div.color_test_item");
    console.log(`hya3: ${node}`);
    let new_node = node.cloneNode(true);
    main_container.appendChild(new_node);
}