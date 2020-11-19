var Notes = [];

class Note {
    constructor(){
        this.element = document.createElement("div");
        this.element.classList.add("note", "noselect");
        builder_interface.appendChild(this.element);

        this.selectable_area = document.createElement("div");
        this.selectable_area.classList.add("note-selectable-area");
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
    select(){
        this.element.classList.add("note-selection-visual");
    }
    deselect(){
        this.element.classList.remove("note-selection-visual");
    }
};

function position_note(note, top, left){
    if(top <= note_tops[3]){
        note.upside_down();
    } else {
        note.rightside_up();
    }
    position_interface_element(note.element, top, left);
}