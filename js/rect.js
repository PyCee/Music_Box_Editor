function one_axis_intersects(base1, length1, base2, length2){
    return base1 + length1 >= base2 && base2 + length2 >= base1;
}
class Rect{
    constructor(top, left, height, width){
        this.top = top;
        this.left = left;
        this.height = height;
        this.width = width;
    }
    intersects(other){
        /* Compatible with getBoundingClientRect() */
        return one_axis_intersects(this.top, this.height, other.top, other.height) &&
            one_axis_intersects(this.left, this.width, other.left, other.width);
    }
}