/* */ 
"format cjs";
import ArrayObservable from '../observables/ArrayObservable';
import ScalarObservable from '../observables/ScalarObservable';
import EmptyObservable from '../observables/EmptyObservable';
import concat from './concat-static';
export default function startWith(...array) {
    let scheduler = array[array.length - 1];
    if (scheduler && typeof scheduler.schedule === 'function') {
        array.pop();
    }
    else {
        scheduler = void 0;
    }
    const len = array.length;
    if (len === 1) {
        return concat(new ScalarObservable(array[0], scheduler), this);
    }
    else if (len > 1) {
        return concat(new ArrayObservable(array, scheduler), this);
    }
    else {
        return concat(new EmptyObservable(scheduler), this);
    }
}
