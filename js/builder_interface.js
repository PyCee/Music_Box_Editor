var builder_interface = document.getElementById("builder-interface");

// TODO: interface_bounds doesn't work when changing window size
var interface_bounds = builder_interface.getBoundingClientRect();

var note_button = document.getElementById("note-button");

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

const note_positioning = {
    top: staff_positioning.top - (staff_positioning.offset * 0.5),
    offset: staff_positioning.offset * 0.5
};

// define valid note tops
var note_tops = [];
for(let i = 0; i < 10; i++){
    note_tops.push(note_positioning.top + note_positioning.offset * i);
}

const SELECTION_TYPE = {
    NONE: 'none',
    SELECTED: 'selected',
    MOVABLE: 'movable',
    DRAG: 'drag-select'

};
var curr_selection_type = SELECTION_TYPE.NONE;
var selected_notes = [];

var note_offsets = [];

function set_note_offsets(top, left){
    note_offsets = [];
    selected_notes.forEach(function(n){
        var offset = {
            top: n.element.offsetTop - top,
            left: n.element.offsetLeft - left
        };
        note_offsets.push(offset);
    });
}