/* */ 
"format cjs";
import publishReplay from './publishReplay';
export default function shareReplay(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
    return publishReplay.call(this, bufferSize, windowTime, scheduler).refCount();
}
