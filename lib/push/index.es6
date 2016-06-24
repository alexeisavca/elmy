import buildModel from "../buildModel/index.es6";

export default model => items => items.push(buildModel(model));