/* */ 
"format cjs";
import { MergeAllOperator } from './mergeAll-support';
export default function mergeAll(concurrent = Number.POSITIVE_INFINITY) {
    return this.lift(new MergeAllOperator(concurrent));
}
