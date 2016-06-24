import {List, OrderedMap} from "immutable";
export default maybeMappable => List.isList(maybeMappable) || OrderedMap.isOrderedMap(maybeMappable);