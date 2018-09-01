/* Creates array of objects from object of objects.
   Also adds new propery to object - id (key) */
function createArrayFromObject(data) {
    let newData = new Array();

    for (let key in data) {
        let obj = data[key];
        obj.id = key;
        newData.push(obj);    
    }

    return newData;
}

module.exports.createArrayFromObject = createArrayFromObject;