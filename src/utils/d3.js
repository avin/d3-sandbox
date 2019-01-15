export function extendSelection(selection) {
    selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };
    selection.prototype.moveToPosition = function(position) {
        return this.each(function() {
            const afterChild = this.parentNode.children[position + 3];
            if (afterChild) {
                this.parentNode.insertBefore(this, afterChild);
            }
        });
    };
}
