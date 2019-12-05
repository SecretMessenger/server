module.exports = function(error){
    // console.log(JSON.stringify(error, null, 2))

    let result = [];
    let keys = Object.keys(error.errors)

    for (let i = 0; i < keys.length; i++) {
        result.push(error.errors[keys[i]].message);
    }
    return result;
}