// Method that is imitating functionality of the JSON.parse function
function myJSONParse(jsonString) {
    // regex for tokenizing jsonString
    const regex = /{|}|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|"|:|(?<=")[\w\s'\\.\-@;]+(?=")|\w+|\btrue|\bfalse|\bnull|\[|\]|,/gm
    // acquiring the tokens
    const tokens = jsonString.match(regex);

    // parsing tokens to generate proper data
    return parse(tokens);
}

// this function checks the token string if it is a number with the help of regex
// this function supports ints, floats, negative values and scientific notation
function isNumber(str) {
    return /-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/gm.test(str);
}

// function for parsing tokens
function parse(tokens, index = { value: 0}) {
    if (tokens[index.value] === "{") return parseObject(tokens, index);
    if (tokens[index.value] === "[") return parseArray(tokens, index);
    if (tokens[index.value] === "true") return true;
    if (tokens[index.value] === "false") return false;
    if (tokens[index.value] === "null") return null;
    if (isNumber(tokens[index.value])) return parseNumber(tokens, index);

        return parseString(tokens, index);
}

// function for parsing tokens into an object
function parseObject(tokens, index) {
    let obj = {};
    // skip {
    index.value++;

    while (tokens[index.value] !== "}") {
        // if token is , then we skip it
        if (tokens[index.value] === ",") {
            index.value++;
            continue;
        }

        // if token is " then it must be property
        if (tokens[index.value] === "\"") {
            // skip "
            index.value++;
            let key = tokens[index.value++];
            // skip "
            index.value++;
            // skip :
            index.value++;
            // parse value of the property
            let value = parse(tokens, index);
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                writable: true
            });
        }
        index.value++;
    }
    return obj;
}

// function for parsing tokens into an array
function parseArray(tokens, index) {
    let array = [];
    // skip [
    index.value++;

    while (tokens[index.value] !== "]") {
        // if token is , then we skip it
        if (tokens[index.value] === ",") {
            index.value++;
            continue;
        }

        // if token is " then it must be a string
        if (tokens[index.value] === "\"") {
            // skip "
            index.value++;
            array.push(parseString(tokens, index));
            // skip ",
            index.value += 2;
            continue;
        }

        array.push(parse(tokens, index))
        index.value++;
    }

    return array;
}

// function for parsing tokens into a number
function parseNumber(tokens, index) {
    // if token contains . then parse as a float, otherwise parse as a integer
    if (tokens[index.value].includes("."))
        return Number.parseFloat(tokens[index.value]);
    else
        return Number.parseInt(tokens[index.value]);
}

// function for parsing tokens as a string
function parseString(tokens, index) {
    // if it is a string covered with "
    if (tokens[index.value] === "\"")  {
        let value;
        // skip "
        index.value++;

        // if it is an empty string then return ""
        if (tokens[index.value] === "\"") return "";
        // otherwise parse token between " "
        value = String(tokens[index.value]);
        // skip "
        index.value++;
        return value;
    }

    // just parse token as a string
    return String(tokens[index.value]);
}

// function for comparing two values even if those are objects
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

// testing objects
const simpleObj = {
    str: '{"name": "Alice", "age": 25}',
    expected: {
        name: "Alice",
        age: 25
    }
};
const nestedObj = {
    str: '{"person": {"name": "Bob", "age": 30, "address": {"city": "New York", "zip": "10001"}}}',
    expected: {
        person: {
            name: "Bob",
            age: 30,
            address: {
                city: "New York",
                zip: "10001"
            }
        }
    }
};
const emptyObj = {
    str: '{}',
    expected: {}
};
const simpleArrayOfNumbers = {
    str: '[1, 2, 3, 4, 5]',
    expected: [1, 2, 3, 4, 5]
};
const booleanValues = {
    str: '{"success": true, "error": false}',
    expected: {
        success: true,
        error: false
    }
};
const integersAndFloats = {
    str: '{"integer": 123, "negativeInteger": -123, "float": 123.45, "negativeFloat": -123.45, "scientific": 1.23e+10}',
    expected: {
        integer: 123,
        negativeInteger: -123,
        float: 123.45,
        negativeFloat: -123.45,
        scientific: 1.23e+10
    }
};
const emptyStringValue = {
    str: '{"empty": ""}',
    expected: {
        empty: ""
    }
};
const arrayOfObjects = {
    str: '[{"name": "Charlie", "age": 35}, {"name": "Dana", "age": 40}]',
    expected: [{name: "Charlie", age: 35}, {name: "Dana", age: 40}],
};
const nestedArray = {
    str: '[[1, 2], [3, 4], [5, 6]]',
    expected: [[1, 2], [3, 4], [5, 6]],
};
const emptyArray = {
    str: '[]',
    expected: [],
};
const mixedDataTypes = {
    str: '{"name": "Eve", "age": 45, "isStudent": false, "courses": ["Math", "Science"], "nullValue": null}',
    expected: {
        name: "Eve",
        age: 45,
        isStudent: false,
        courses: ["Math", "Science"],
        nullValue: null
    }
};

// testing
console.log("Simple object test: " + deepEqual(simpleObj.expected, myJSONParse(simpleObj.str)));
console.log("Nested object test: " + deepEqual(nestedObj.expected, myJSONParse(nestedObj.str)));
console.log("Empty object test: " + deepEqual(emptyObj.expected, myJSONParse(emptyObj.str)));
console.log("Simple array of numbers test: " + deepEqual(simpleArrayOfNumbers.expected, myJSONParse(simpleArrayOfNumbers.str)));
console.log("Boolean values test: " + deepEqual(booleanValues.expected, myJSONParse(booleanValues.str)));
console.log("Integer and floats test: " + deepEqual(integersAndFloats.expected, myJSONParse(integersAndFloats.str)));
console.log("Empty string value test: " + deepEqual(emptyStringValue.expected, myJSONParse(emptyStringValue.str)));
console.log("Array of objects test: " + deepEqual(arrayOfObjects.expected, myJSONParse(arrayOfObjects.str)));
console.log("Nested array test: " + deepEqual(nestedArray.expected, myJSONParse(nestedArray.str)));
console.log("Empty array test: " + deepEqual(emptyArray.expected, myJSONParse(emptyArray.str)));
console.log("Mixed data types test: " + deepEqual(mixedDataTypes.expected, myJSONParse(mixedDataTypes.str)));

