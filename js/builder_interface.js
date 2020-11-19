var builder_interface = document.getElementById("builder-interface");

// TODO: interface_bounds doesn't work when changing window size
var interface_bounds = builder_interface.getBoundingClientRect();

var note_button = document.getElementById("note-button");
var delete_button = document.getElementById("delete-button");

function position_interface_element(element, top, left){
    if(top != null)
        element.style.top = top + "px";
    if(left != null)
        element.style.left = left + "px";
}

var treble_bounds = document.getElementById("treble-clef").getBoundingClientRect();
const staff_positioning = {
    top: (treble_bounds.top - interface_bounds.top) + (treble_bounds.height * 0.20),
    offset: treble_bounds.height * 0.14
};
var staff_lines = [];
for(let i = 0; i < 5; i++){
    var element = document.createElement("hr");
    element.className = "staff-line";
    position_interface_element(element, staff_positioning.top + i * staff_positioning.offset, null);
    builder_interface.appendChild(element);
    staff_lines.push(element);
}

const bar_positioning = {
    top: staff_positioning.top,
    top_offset: 0,
    left: 200,
    left_offset: 300
};
var bar_lefts = [];
for(let i = 0; i < 3; i++){
    bar_lefts.push(bar_positioning.left + bar_positioning.left_offset * i);
}
for(let i = 0; i < 3; i++){
    var bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = staff_positioning.offset * 4 + "px"
    builder_interface.appendChild(bar);
    position_interface_element(bar, bar_positioning.top, bar_lefts[i]);
}
var note_width;
{
    var tmp_note = new Note();
    note_width = tmp_note.element.offsetWidth;
    builder_interface.removeChild(tmp_note.element);
    tmp_note.remove();
}
var extra_bar_width = bar_positioning.left_offset - (note_width * 4);
var note_initial_left_offset = bar_positioning.left + (extra_bar_width / 8.0);
var note_offset = note_width + (extra_bar_width / 4.0);

const note_positioning = {
    top: staff_positioning.top - (staff_positioning.offset * 0.5),
    top_offset: staff_positioning.offset * 0.5,
    left: note_initial_left_offset,
    left_offset: note_offset
};

// define valid note tops
var note_tops = [];
for(let i = 0; i < 10; i++){
    note_tops.push(note_positioning.top + note_positioning.top_offset * i);
}
var note_lefts = [];
for(let i = 0; i < 10; i++){
    note_lefts.push(note_positioning.left + note_positioning.left_offset * i);
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
function set_relative_note_offsets(e){
    // Set note offsets relative to mouse position from event (e)
    set_note_offsets(e.clientY - interface_bounds.top, e.clientX - interface_bounds.left);
}

function select_note(n){
    selected_notes.push(n);
    n.select();
}
function deselect_note(n){
    n.deselect();
    selected_notes.splice(selected_notes.indexOf(n), 1);
}
function reset_selection(){
    curr_selection_type = SELECTION_TYPE.NONE;
    selected_notes.forEach(function(n){
        n.deselect();
    });
    selected_notes = [];
    note_offsets = [];
}
function delete_selected_notes(){
    selected_notes.forEach(function(n){
        builder_interface.removeChild(n.element);
        Notes.splice(Notes.indexOf(n), 1);
    });
    reset_selection();
}
function delete_notes_out_of_bounds(){
    // Filter out any notes that are outisde of the bounds 
    //  removes from builder_interface.children, Notes, and selected_notes
    
    function is_note_in_bounds(n){
        return n.element.offsetTop > note_tops[0] && 
        n.element.offsetTop < note_tops[note_tops.length - 1];
    }
    selected_notes.forEach(function(n){
        if(!is_note_in_bounds(n)){
            builder_interface.removeChild(n.element);
        }
    });
    Notes = Notes.filter(is_note_in_bounds);
    selected_notes = selected_notes.filter(is_note_in_bounds);
}