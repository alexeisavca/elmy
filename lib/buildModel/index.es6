import {fromJS} from "immutable";
let buildModel = ({model = fromJS({}), adopt = {}}) =>
    Object.keys(adopt).reduce((model, key) => model.has(key) ? model :
        model.set(key, buildModel(adopt[key])), model);

export default buildModel;