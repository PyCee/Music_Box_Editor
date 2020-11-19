

builder_interface.addEventListener("mousedown", begin_selection);
builder_interface.addEventListener("mouseup", end_selection);

note_button.addEventListener("mousedown", function(e){
    // When the user clicks on the note button
    // Create a new note and prepare it for mouse movement
    reset_selection();
    var new_note = new Note();
    position_note(new_note, e.clientY - interface_bounds.top, e.clientX - interface_bounds.left);
    select_note(new_note);

    set_relative_note_offsets(e);

    curr_selection_type = SELECTION_TYPE.MOVABLE;
    event.stopPropagation();
});

// TODO: also do this on press delete or backspace button(s)
function delete_selected_notes_event(e){
    delete_selected_notes();
    e.stopPropagation();
}
delete_button.addEventListener("mousedown", delete_selected_notes_event);
document.addEventListener("keydown", handle_key_down);  //or however you are calling your method
function handle_key_down(e)
{
   var KeyID = e.keyCode;
   switch(KeyID)
   {
      case 8: /* backspace */
        delete_selected_notes_event(e);
        e.preventDefault();
      break; 
      case 46: /* delete */
        delete_selected_notes_event(e);
      break;
      default:
      break;
   }
}

var drag_selection = document.createElement("div");
var drag_selection_area = new Rect(0, 0, 0, 0);
drag_selection.id = "drag-box";
builder_interface.appendChild(drag_selection);
function reset_drag_selection(){
    position_interface_element(drag_selection, 0, 0);
    drag_selection.style.height = 0;
    drag_selection.style.width = 0;
}
function select_drag_area(){
    // Loop through notes to check for overlap and select them
    var drag_box = drag_selection.getBoundingClientRect();
    Notes.forEach(function(n){
        var note_box = n.selectable_area.getBoundingClientRect();
        if(bounding_box_intersects(drag_box, note_box)){
            select_note(n);
            curr_selection_type = SELECTION_TYPE.SELECTED;
        }
    });
}
function update_drag_selection_visuals(){
    function calculate_drag_selection_dimensions(origin, length){
        var tmp_origin = origin;
        var tmp_length = length;
        if(length < 0.0) {
            tmp_origin = origin + length;
            tmp_length = -1.0 * length;
        }
        return {tmp_origin, tmp_length};
    }
    var vert_dimension = calculate_drag_selection_dimensions(
        drag_selection_area.top, drag_selection_area.height);
    var hori_dimension = calculate_drag_selection_dimensions(
        drag_selection_area.left, drag_selection_area.width);
    position_interface_element(drag_selection, vert_dimension.tmp_origin, hori_dimension.tmp_origin);
    drag_selection.style.height = vert_dimension.tmp_length + "px";
    drag_selection.style.width = hori_dimension.tmp_length + "px";
}

var drag_origin = {
    top: 0,
    left: 0
};

function begin_selection(e){
    var click_box = new Rect(e.clientY, e.clientX, 0, 0);
    
    switch(curr_selection_type){
        case SELECTION_TYPE.NONE:
            // If nothing is selected, make a selection

            Notes.forEach(function(n){
                var note_box = n.selectable_area.getBoundingClientRect();
                if(bounding_box_intersects(click_box, note_box)){
                    select_note(n);
                    set_relative_note_offsets(e);
                    curr_selection_type = SELECTION_TYPE.MOVABLE;
                }
            });
            if(selected_notes.length == 0){
                // If no note was clicked
                // Start drag-select
                drag_selection_area.top = e.clientY - interface_bounds.top;
                drag_selection_area.left = e.clientX - interface_bounds.left;

                curr_selection_type = SELECTION_TYPE.DRAG;
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
                set_relative_note_offsets(e);
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

            // Delete notes that are out of bounds
            delete_notes_out_of_bounds();

            curr_selection_type = SELECTION_TYPE.SELECTED;
            break;
        case SELECTION_TYPE.DRAG:
            reset_selection();
            select_drag_area();
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

                // TODO: combine align_note_top/left

                function align_note_top(floating_note_top){
                    // Calculate note position clamped to valid positions
                    // Returns null when floating_note_top is out of bounds

                    var zeroed_top = floating_note_top - (note_positioning.top);
                    var scaled_top = zeroed_top / note_positioning.top_offset;
                    var note_top_index = Math.floor(scaled_top);
                    if(note_top_index >= 0 && note_top_index < note_tops.length){
                        return note_tops[note_top_index];
                    } else {
                        return null;
                    }
                }
                var floating_note_top = e.clientY + note_offsets[i].top + 
                    note_positioning.top_offset * 0.5 - interface_bounds.top;
                var note_top = align_note_top(floating_note_top);
                if(note_top == null){
                    note_top = floating_note_top;
                }

                function align_note_left(floating_note_left){
                    // Calculate note position clamped to valid positions
                    // Returns null when floating_note_top is out of bounds

                    var zeroed_left = floating_note_left - (note_positioning.left);
                    var scaled_left = zeroed_left / note_positioning.left_offset;
                    var note_left_index = Math.floor(scaled_left);
                    if(note_left_index >= 0 && note_left_index < note_lefts.length){
                        return note_lefts[note_left_index];
                    } else {
                        return null;
                    }
                }

                var floating_note_left = e.clientX + note_offsets[i].left + 
                note_positioning.left_offset * 0.5 - interface_bounds.left;
                var note_left = align_note_left(floating_note_left);
                if(note_left == null){
                    note_left = floating_note_left;
                }
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