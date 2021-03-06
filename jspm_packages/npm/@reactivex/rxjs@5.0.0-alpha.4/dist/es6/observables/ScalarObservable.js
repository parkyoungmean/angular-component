/* */ 
"format cjs";
import Observable from '../Observable';
import tryCatch from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import ErrorObservable from './ErrorObservable';
import EmptyObservable from './EmptyObservable';
export default class ScalarObservable extends Observable {
    constructor(value, scheduler) {
        super();
        this.value = value;
        this.scheduler = scheduler;
        this._isScalar = true;
    }
    static create(value, scheduler) {
        return new ScalarObservable(value, scheduler);
    }
    static dispatch(state) {
        const { done, value, subscriber } = state;
        if (done) {
            subscriber.complete();
            return;
        }
        subscriber.next(value);
        if (subscriber.isUnsubscribed) {
            return;
        }
        state.done = true;
        this.schedule(state);
    }
    _subscribe(subscriber) {
        const value = this.value;
        const scheduler = this.scheduler;
        if (scheduler) {
            subscriber.add(scheduler.schedule(ScalarObservable.dispatch, 0, {
                done: false, value, subscriber
            }));
        }
        else {
            subscriber.next(value);
            if (!subscriber.isUnsubscribed) {
                subscriber.complete();
            }
        }
    }
}
// TypeScript is weird about class prototype member functions and instance properties touching on it's plate.
const proto = ScalarObservable.prototype;
proto.map = function (project, thisArg) {
    let result = tryCatch(project).call(thisArg || this, this.value, 0);
    if (result === errorObject) {
        return new ErrorObservable(errorObject.e);
    }
    else {
        return new ScalarObservable(project.call(thisArg || this, this.value, 0));
    }
};
proto.filter = function (select, thisArg) {
    let result = tryCatch(select).call(thisArg || this, this.value, 0);
    if (result === errorObject) {
        return new ErrorObservable(errorObject.e);
    }
    else if (result) {
        return this;
    }
    else {
        return new EmptyObservable();
    }
};
proto.reduce = function (project, acc) {
    if (typeof acc === 'undefined') {
        return this;
    }
    let result = tryCatch(project)(acc, this.value);
    if (result === errorObject) {
        return new ErrorObservable(errorObject.e);
    }
    else {
        return new ScalarObservable(result);
    }
};
proto.scan = function (project, acc) {
    return this.reduce(project, acc);
};
proto.count = function (predicate, thisArg) {
    if (!predicate) {
        return new ScalarObservable(1);
    }
    else {
        let result = tryCatch(predicate).call(thisArg || this, this.value, 0, this);
        if (result === errorObject) {
            return new ErrorObservable(errorObject.e);
        }
        else {
            return new ScalarObservable(result ? 1 : 0);
        }
    }
};
proto.skip = function (count) {
    if (count > 0) {
        return new EmptyObservable();
    }
    return this;
};
proto.take = function (count) {
    if (count > 0) {
        return this;
    }
    return new EmptyObservable();
};
