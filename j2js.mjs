import process from 'process'
import fs from 'fs'

const inputFile = process.argv[2]
if (!inputFile) {
    console.log("Convert JSON(None-strict JSON aka JS Object Defination) to JSON-Schema")
    console.log("Usage: node j2js.mjs <path/to/your/file>")
    process.exit(0)
}

if (!fs.existsSync(inputFile)) {
    console.log("Input file does not exsist")
    process.exit(1)
}

const input = eval(`(${fs.readFileSync(inputFile)})`)

function createTree(obj, tree) {
    if (obj === null) {
        tree.type = 'null'
    } else if (typeof obj === 'object') {
        if (obj instanceof Array) {
            tree.type = "array"
            tree.items = {}
            
            if (obj.length !== 0) {
                createTree(obj[0], tree.items)
            }
        } else {
            tree.type = "object"
            tree.properties = {}
            
            for (const i in obj) {
                if (typeof i === 'function') continue

                tree.properties[i] = {}
                createTree(obj[i], tree.properties[i])
            }
        }
    } else {
        tree.type = typeof obj
    }

    return JSON.stringify(tree, null, 2)
}

console.log(createTree(input, {}))