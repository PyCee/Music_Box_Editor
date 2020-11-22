var Notes = [];

var TOP_NOTE = "F5";

class Note {
    constructor(){
        this.snap_to_time = true;
        
        this.element = document.createElement("div");
        this.element.classList.add("note", "noselect");
        builder_interface.appendChild(this.element);

        this.selectable_area = document.createElement("div");
        this.selectable_area.classList.add("note-selectable-area");
        this.element.appendChild(this.selectable_area);

        Notes.push(this);
    }
    get_note(){
        // Find note value based on positioning
        // Returns note value ("C4", "D5", "B3")
        var zeroed_top = this.element.offsetTop - note_positioning.top;
        var scaled_top = zeroed_top / note_positioning.top_offset;
        var note_index = Math.round(scaled_top);

        var note = TOP_NOTE.charCodeAt(0);
        var note_number = TOP_NOTE.charCodeAt(1);
        for(let i = 0; i < note_index; i++){
            if(note == "A".charCodeAt(0)){
                note = "G".charCodeAt(0);
                note_number -= 1;
            } else {
                note -= 1;
            }
        }
        return String.fromCharCode(note) + String.fromCharCode(note_number);
    }
    get_time(){
        var zeroed_time = this.element.offsetLeft - note_positioning.left;
        var scaled_time = zeroed_time / note_positioning.left_offset;
        var note_time = Math.round(scaled_time);
        return note_time + 1;
    }
    remove(){
        Notes.splice(Notes.indexOf(this), 1);
    }
    upside_down(){
        this.element.classList.add("flipped");
    }
    rightside_up(){
        this.element.classList.remove("flipped");
    }
    select(){
        this.element.classList.add("note-selection-visual");
    }
    deselect(){
        this.element.classList.remove("note-selection-visual");
    }
    set_snap_to_time(snap){
        this.snap_to_time = snap;
    }
};

function position_note(note, top, left, bounded=false){
    if(top <= note_tops[3]){
        note.upside_down();
    } else {
        note.rightside_up();
    }
    if(bounded){
        if(top != null)
            top = Math.min(Math.max(top, note_tops[0]), note_tops[note_tops.length-1]);
        if(left != null)
            left = Math.min(Math.max(left, note_lefts[0]), note_lefts[note_lefts.length-1]);
    }
    position_interface_element(note.element, top, left);
}