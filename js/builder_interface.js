var builder_interface = document.getElementById("builder-interface");
var interface_bounds = builder_interface.getBoundingClientRect();

function position_interface_element(element, top, left){
    if(top != null)
        element.style.top = top + "px";
    if(left != null)
        element.style.left = left + "px";
}

const staff_positioning = {
    top: 107,
    offset: 43
};
var staff_lines = [];
for(let i = 0; i < 5; i++){
    var element = document.createElement("hr");
    element.className = "staff-line";
    position_interface_element(element, staff_positioning.top + i * staff_positioning.offset, null);
    builder_interface.appendChild(element);
    staff_lines.push(element);
}