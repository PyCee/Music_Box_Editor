

builder_interface.addEventListener("mousedown", begin_selection);
builder_interface.addEventListener("mouseup", end_selection);

const SELECTION_TYPE = {
    CLICK: 'click',
    DRAG: 'drag'
};
var curr_selection_type = null;
var selected_notes = [];
var note_offsets = [];

var drag_origin = {
    top: 0,
    left: 0
};

function begin_selection(e){
    var click_box = new Rect(e.clientY, e.clientX, 0, 0);
    

    Notes.forEach(function(n){
        var note_box = n.selectable_area.getBoundingClientRect();
        if(click_box.intersects(note_box)){
            var offset = {
                top: note_box.top - e.clientY,
                left: note_box.left - e.clientX
            };
            selected_notes.push(n);
            note_offsets.push(offset);
            curr_selection_type = SELECTION_TYPE.CLICK;
        }
    });

    if(selected_notes.length == 0){
        // If no note was clicked
        // Start drag-select
        curr_selection_type = SELECTION_TYPE.DRAG;
        drag_origin.top = e.clientY;
        drag_origin.left = e.clientX;
    }
}

function end_selection(e){
    switch(curr_selection_type){
        case SELECTION_TYPE.CLICK:
            curr_selection_type = null;
            selected_notes = [];
            note_offsets = [];
            break;
        case SELECTION_TYPE.DRAG:
            break;
        default:
            console.error("Unknown selection type on mouse move: " + curr_selection_type);
            break;
    }
    // If selection_type == click
    // deselect all
    // Else if selection_type == drag
    // select all in box
}


builder_interface.addEventListener("mousemove", drag_note);
function drag_note(e){
    // switch(curr_selection_type){
    //     case SELECTION_TYPE.CLICK:

    //         break;
    //     case SELECTION_TYPE.DRAG:
    //         break;
    //     default:
    //         console.error("Unknown selection type on mouse move: " + curr_selection_type);
    //         break;
    // }
    // If click selection
    // Move notes like below
    // Else if drag select
    // Update drag select visual

    for(let i = 0; i < selected_notes.length; i++){
        var floating_note_top = e.clientY + note_offsets[i].top + 
            note_positioning.offset * 0.5 - interface_bounds.top;

        var zeroed_top = floating_note_top - (note_positioning.top);
        var scaled_top = zeroed_top / note_positioning.offset;
        var note_top_index = Math.floor(scaled_top);
        note_top_index = Math.max(note_top_index, 0);
        position_note(selected_notes[i],
            note_tops[note_top_index], null);
    }
}


var bar = document.createElement("div");
bar.classList.add("bar");
bar.style.height = staff_positioning.offset * 4 + "px"
builder_interface.appendChild(bar);
position_interface_element(bar, staff_positioning.top, 425);