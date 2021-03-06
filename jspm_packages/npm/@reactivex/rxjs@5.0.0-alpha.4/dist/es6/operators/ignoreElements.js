/* */ 
"format cjs";
import Subscriber from '../Subscriber';
export default function ignoreElements() {
    return this.lift(new IgnoreElementsOperator());
}
;
class IgnoreElementsOperator {
    call(subscriber) {
        return new IgnoreElementsSubscriber(subscriber);
    }
}
class IgnoreElementsSubscriber extends Subscriber {
    _next() { }
}
