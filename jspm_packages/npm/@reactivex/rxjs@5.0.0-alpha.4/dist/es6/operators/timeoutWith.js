/* */ 
"format cjs";
import immediate from '../schedulers/immediate';
import isDate from '../util/isDate';
import OuterSubscriber from '../OuterSubscriber';
import subscribeToResult from '../util/subscribeToResult';
export default function timeoutWith(due, withObservable, scheduler = immediate) {
    let absoluteTimeout = isDate(due);
    let waitFor = absoluteTimeout ? (+due - scheduler.now()) : due;
    return this.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
}
class TimeoutWithOperator {
    constructor(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    call(subscriber) {
        return new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler);
    }
}
class TimeoutWithSubscriber extends OuterSubscriber {
    constructor(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        super(destination);
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
        this.timeoutSubscription = undefined;
        this.timedOut = false;
        this.index = 0;
        this._previousIndex = 0;
        this._hasCompleted = false;
        this.scheduleTimeout();
    }
    get previousIndex() {
        return this._previousIndex;
    }
    get hasCompleted() {
        return this._hasCompleted;
    }
    static dispatchTimeout(state) {
        const source = state.subscriber;
        const currentIndex = state.index;
        if (!source.hasCompleted && source.previousIndex === currentIndex) {
            source.handleTimeout();
        }
    }
    scheduleTimeout() {
        let currentIndex = this.index;
        const timeoutState = { subscriber: this, index: currentIndex };
        this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, timeoutState);
        this.index++;
        this._previousIndex = currentIndex;
    }
    _next(value) {
        if (!this.timedOut) {
            this.destination.next(value);
            if (!this.absoluteTimeout) {
                this.scheduleTimeout();
            }
        }
    }
    _error(err) {
        if (!this.timedOut) {
            this.destination.error(err);
            this._hasCompleted = true;
        }
    }
    _complete() {
        if (!this.timedOut) {
            this.destination.complete();
            this._hasCompleted = true;
        }
    }
    handleTimeout() {
        const withObservable = this.withObservable;
        this.timedOut = true;
        this.add(this.timeoutSubscription = subscribeToResult(this, withObservable));
    }
}
