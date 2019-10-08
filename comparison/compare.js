/**
 * Just a first, simple implementation of comarators for different datatypes.
 * To be replaced by a call to the backend eventually.
 * 
 * All similarity values are normalized to [0,1].
 */

import edit_distance from "./edit_distance.js";

export default class Comparators {

    constructor() {

    }

    compare(type, val1, val2) {
        // get all comparator functions defined and map them to the type
        return this["compare_" + type](val1, val2);
    }

    compare_categorical(val1, val2) {
        // just check for the same value for now
        return val1 === val2 ? 1 : 0;
    }

    compare_numerical(val1, val2) {
        //  we do not have any distribution information for now,
        // so we just check for identity
        return val1 === val2 ? 1 : 0;
    }

    compare_set(val1, val2) {
        let set1 = new Set(val1);
        let set2 = new Set(val2);
        let overlap = 0;
        set1.forEach(el => {
            if (set2.has(el)) {
                overlap++;
            }
        });
        return (overlap / (set1.size + set2.size - overlap));
    }

    compare_text(val1, val2) {
        if (typeof val1 !== "string" && typeof val2 !== "string") return 0;
        if (typeof val1 !== "string") return 1;
        if (typeof val2 !== "string") return -1;

        // jaccard coefficient for now
        let text1 = new Set(val1.split(" "));
        let text2 = new Set(val2.split(" "));
        return this.compare_set(text1, text2);
    }

    compare_shorttext(val1, val2) {
        return edit_distance(val1, val2) / (Math.max(val1.length, val2.length));
    }

    compare_image(val1, val2) {
        // in the future: compare images, not url strings
        return edit_distance(val1, val2) / (Math.max(val1.length, val2.length));
    }

}