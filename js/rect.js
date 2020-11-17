function one_axis_intersects(base1, length1, base2, length2){
    return base1 + length1 >= base2 && base2 + length2 >= base1;
}

function bounding_box_intersects(box1, box2){
    /* Compatible with getBoundingClientRect() */
    return one_axis_intersects(box1.top, box1.height, box2.top, box2.height) &&
        one_axis_intersects(box1.left, box1.width, box2.left, box2.width);
}
class Rect{
    constructor(top, left, height, width){
        this.top = top;
        this.left = left;
        this.height = height;
        this.width = width;
    }
}