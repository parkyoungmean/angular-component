/* */ 
"format cjs";
import Subscriber from '../Subscriber';
export default function skipUntil(total) {
    return this.lift(new SkipUntilOperator(total));
}
class SkipUntilOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber) {
        return new SkipUntilSubscriber(subscriber, this.notifier);
    }
}
class SkipUntilSubscriber extends Subscriber {
    constructor(destination, notifier) {
        super(destination);
        this.notifier = notifier;
        this.notificationSubscriber = null;
        this.notificationSubscriber = new NotificationSubscriber(this);
        this.add(this.notifier.subscribe(this.notificationSubscriber));
    }
    _next(value) {
        if (this.notificationSubscriber.hasValue) {
            this.destination.next(value);
        }
    }
    _complete() {
        if (this.notificationSubscriber.hasCompleted) {
            this.destination.complete();
        }
        this.notificationSubscriber.unsubscribe();
    }
}
class NotificationSubscriber extends Subscriber {
    constructor(parent) {
        super(null);
        this.parent = parent;
        this.hasValue = false;
        this.hasCompleted = false;
    }
    _next(unused) {
        this.hasValue = true;
    }
    _error(err) {
        this.parent.error(err);
        this.hasValue = true;
    }
    _complete() {
        this.hasCompleted = true;
    }
}
