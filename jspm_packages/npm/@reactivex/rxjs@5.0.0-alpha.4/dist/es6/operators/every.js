/* */ 
"format cjs";
import ScalarObservable from '../observables/ScalarObservable';
import ArrayObservable from '../observables/ArrayObservable';
import ErrorObservable from '../observables/ErrorObservable';
import Subscriber from '../Subscriber';
import tryCatch from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import bindCallback from '../util/bindCallback';
export default function every(predicate, thisArg) {
    const source = this;
    let result;
    if (source._isScalar) {
        result = tryCatch(predicate)(source.value, 0, source);
        if (result === errorObject) {
            return new ErrorObservable(errorObject.e, source.scheduler);
        }
        else {
            return new ScalarObservable(result, source.scheduler);
        }
    }
    if (source instanceof ArrayObservable) {
        const array = source.array;
        let result = tryCatch((array, predicate) => array.every(predicate))(array, predicate);
        if (result === errorObject) {
            return new ErrorObservable(errorObject.e, source.scheduler);
        }
        else {
            return new ScalarObservable(result, source.scheduler);
        }
    }
    return source.lift(new EveryOperator(predicate, thisArg, source));
}
class EveryOperator {
    constructor(predicate, thisArg, source) {
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
    }
    call(observer) {
        return new EverySubscriber(observer, this.predicate, this.thisArg, this.source);
    }
}
class EverySubscriber extends Subscriber {
    constructor(destination, predicate, thisArg, source) {
        super(destination);
        this.thisArg = thisArg;
        this.source = source;
        this.predicate = undefined;
        this.index = 0;
        if (typeof predicate === 'function') {
            this.predicate = bindCallback(predicate, thisArg, 3);
        }
    }
    notifyComplete(everyValueMatch) {
        this.destination.next(everyValueMatch);
        this.destination.complete();
    }
    _next(value) {
        const predicate = this.predicate;
        if (predicate === undefined) {
            this.destination.error(new TypeError('predicate must be a function'));
        }
        let result = tryCatch(predicate)(value, this.index++, this.source);
        if (result === errorObject) {
            this.destination.error(result.e);
        }
        else if (!result) {
            this.notifyComplete(false);
        }
    }
    _complete() {
        this.notifyComplete(true);
    }
}
