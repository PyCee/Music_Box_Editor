

builder_interface.addEventListener("mousedown", begin_selection);
builder_interface.addEventListener("mouseup", end_selection);

note_button.addEventListener("mousedown", function(e){
    // When the user clicks on the note button
    // Create a new note and prepare it for mouse movement
    selected_notes = [];
    var new_note = new Note();
    position_note(new_note, e.clientY - interface_bounds.top, e.clientX - interface_bounds.left);
    selected_notes.push(new_note);
    note_offsets = [];
    note_offsets.push({top: 0, left: 0});
    curr_selection_type = SELECTION_TYPE.MOVABLE;
    event.stopPropagation();
});

var drag_selection = document.createElement("div");
var drag_selection_area = new Rect(0, 0, 0, 0);
drag_selection.id = "drag-box";
builder_interface.appendChild(drag_selection);
function reset_drag_selection(){
    position_interface_element(drag_selection, 0, 0);
    drag_selection.style.height = 0;
    drag_selection.style.width = 0;
}
function update_drag_selection_visuals(){
    var dimensions = new Rect(0, 0, 0, 0);
    if(drag_selection_area.height >= 0.0){
        dimensions.top = drag_selection_area.top;
        dimensions.height = drag_selection_area.height;
    } else {
        dimensions.top = drag_selection_area.top + drag_selection_area.height;
        dimensions.height = -1.0 * drag_selection_area.height;
    }
    if(drag_selection_area.width >= 0.0){
        dimensions.left = drag_selection_area.left;
        dimensions.width = drag_selection_area.width;
    } else {
        dimensions.left = drag_selection_area.left + drag_selection_area.width;
        dimensions.width = -1.0 * drag_selection_area.width;
    }
    position_interface_element(drag_selection, dimensions.top, dimensions.left);
    drag_selection.style.height = dimensions.height + "px";
    drag_selection.style.width = dimensions.width + "px";
}

var drag_origin = {
    top: 0,
    left: 0
};

function reset_selection(){
    curr_selection_type = SELECTION_TYPE.NONE;
    selected_notes = [];
    note_offsets = [];
}

function begin_selection(e){
    var click_box = new Rect(e.clientY, e.clientX, 0, 0);
    
    switch(curr_selection_type){
        case SELECTION_TYPE.NONE:
            // If nothing is selected, make a selection

            Notes.forEach(function(n){
                var note_box = n.selectable_area.getBoundingClientRect();
                if(bounding_box_intersects(click_box, note_box)){
                    selected_notes.push(n);
                    curr_selection_type = SELECTION_TYPE.MOVABLE;
                }
            });
            if(selected_notes.length == 0){
                // If no note was clicked
                // Start drag-select
                drag_selection_area.top = e.clientY - interface_bounds.top;
                drag_selection_area.left = e.clientX - interface_bounds.left;

                curr_selection_type = SELECTION_TYPE.DRAG;
            } else {
                set_note_offsets(e.clientY - interface_bounds.top, e.clientX - interface_bounds.left);
            }
            break;
        case SELECTION_TYPE.SELECTED:
            var intersecting = false;
            selected_notes.forEach(function(n){
                var note_box = n.selectable_area.getBoundingClientRect();
                if(bounding_box_intersects(click_box, note_box)){
                    intersecting = true;
                }
            });
            if(intersecting){
                // If the click is on one of the currently selected notes
                set_note_offsets(e.clientY - interface_bounds.top, e.clientX - interface_bounds.left);
                curr_selection_type = SELECTION_TYPE.MOVABLE;
            } else {
                // Otherwise, reset selection status
                reset_selection();
                begin_selection(e);
            }
            break;
        default:
            break;
    }
}

function end_selection(e){
    switch(curr_selection_type){
        case SELECTION_TYPE.NONE:
            break;
        case SELECTION_TYPE.SELECTED:
            break;
        case SELECTION_TYPE.MOVABLE:

            // Filter out any notes that are outisde of the bounds
            selected_notes.forEach(function(n){
                if(n.element.offsetTop < note_tops[0] || 
                    n.element.offsetTop > note_tops[note_tops.length - 1]){
                    // Delete all references to n
                    builder_interface.removeChild(n.element);
                }
            });
            function is_note_position_valid(n){
                return n.element.offsetTop > note_tops[0] && 
                n.element.offsetTop < note_tops[note_tops.length - 1];
            }
            Notes = Notes.filter(is_note_position_valid);
            selected_notes = selected_notes.filter(is_note_position_valid);
            
            curr_selection_type = SELECTION_TYPE.SELECTED;
            break;
        case SELECTION_TYPE.DRAG:
            // Loop through notes to check for overlap and select them
            var drag_box = drag_selection.getBoundingClientRect();
            Notes.forEach(function(n){
                var note_box = n.selectable_area.getBoundingClientRect();
                if(bounding_box_intersects(drag_box, note_box)){
                    selected_notes.push(n);
                    curr_selection_type = SELECTION_TYPE.SELECTED;
                }
            });
            // If there is no selection after checking
            if(selected_notes.length == 0){
                reset_selection();
            }
            reset_drag_selection();
            break;
        default:
            console.error("Unknown selection type on mouse move: " + curr_selection_type);
            break;
    }
}

builder_interface.addEventListener("mousemove", drag_note);
function drag_note(e){
    switch(curr_selection_type){
        case SELECTION_TYPE.MOVABLE:
            // Move the selected notes
            for(let i = 0; i < selected_notes.length; i++){
                var floating_note_top = e.clientY + note_offsets[i].top + 
                    note_positioning.offset * 0.5 - interface_bounds.top;
        
                var zeroed_top = floating_note_top - (note_positioning.top);
                var scaled_top = zeroed_top / note_positioning.offset;
                var note_top_index = Math.floor(scaled_top);

                var note_top = 0;
                if(note_top_index < 0 || note_top_index >= note_tops.length){
                    note_top = floating_note_top;
                } else {
                    note_top = note_tops[note_top_index];
                }

                var note_left = e.clientX - interface_bounds.left;

                position_note(selected_notes[i],
                    note_top, note_left);
            }
            break;
        case SELECTION_TYPE.SELECTED:
            break;
        case SELECTION_TYPE.NONE:
            break;
        case SELECTION_TYPE.DRAG:
            // Update drag selection based on mouse position
            drag_selection_area.height = (e.clientY - interface_bounds.top - drag_selection_area.top);
            drag_selection_area.width = (e.clientX - interface_bounds.left - drag_selection_area.left);
            update_drag_selection_visuals();
            break;
        default:
            console.error("Unknown selection type on mouse move: " + curr_selection_type);
            break;
    }
}


var bar = document.createElement("div");
bar.classList.add("bar");
bar.style.height = staff_positioning.offset * 4 + "px"
builder_interface.appendChild(bar);
position_interface_element(bar, staff_positioning.top, 425);