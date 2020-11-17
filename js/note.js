var Notes = [];

class Note {
    constructor(){
        this.element = document.createElement("div");
        this.element.classList.add("note");
        builder_interface.appendChild(this.element);

        this.selectable_area = document.createElement("div");
        this.selectable_area.classList.add("note-selectable-area");
        // selectable_area.addEventListener("mousedown", this.select.bind(this));
        // selectable_area.addEventListener("mouseup", this.deselect.bind(this));
        this.element.appendChild(this.selectable_area);

        Notes.push(this);
    }
    remove(){
        Notes.remove(this);
    }
    upside_down(){
        this.element.classList.add("flipped");
    }
    rightside_up(){
        this.element.classList.remove("flipped");
    }
};

const note_positioning = {
    top: staff_positioning.top - (staff_positioning.offset * 0.5),
    offset: staff_positioning.offset * 0.5
};

// define valid note tops
var note_tops = [];
for(let i = 0; i < 10; i++){
    note_tops.push(note_positioning.top + note_positioning.offset * i);
}

// TMP: make test notes
for(let i = 0; i < note_tops.length; i++){
    var note = new Note();
    position_note(note, note_tops[i], i * 75 + 130);
}
// /TMP

function position_note(note, top, left){
    if(top <= note_tops[4]){
        note.upside_down();
    } else {
        note.rightside_up();
    }
    position_interface_element(note.element, top, left);
}