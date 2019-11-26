import { difference, has, hasPath, keys, union } from "ramda"

interface Diff {
    add: Record<string, any>,
    remove: Record<string, any>
}

const findDifference = (
    allKeys: string[],
    objectOne: Record<string, any>,
    objectTwo: Record<string, any>,
    add: any = {},
    remove: any = {}): Diff => {

    while (allKeys.length > 0) {
        const currentKey = allKeys.shift() as string
        const currentValue = objectOne[currentKey]
        if (typeof currentValue === "object" && !Array.isArray(currentKey)) {
            return findDifference(allKeys, currentValue, objectTwo[currentKey], add, remove)
        }
        if (has(currentKey, objectOne)) {
            if (!has(currentKey, objectTwo)) {
                remove[currentKey] = "removed"
            } else {
                const newValue = objectTwo[currentKey]
                if (currentValue !== newValue) {
                    remove[currentKey] = "removed"
                    add[currentKey] = newValue
                }
            }
        } else {
            add[currentKey] = objectTwo[currentKey]
        }
        return findDifference(allKeys, objectOne, objectTwo, add, remove)
    }
    return {
        add,
        remove,
    }
}

const compareObjects = (objectOne: Record<string, any>, objectTwo: Record<string, any>) => {
    const allKeys = union(keys(objectOne), keys(objectTwo))
    const { add, remove } = findDifference(allKeys, objectOne, objectTwo)
    const patch = []

    for (const removePath of keys(remove)) {
        patch.push({ op: "remove", path: "/" + (removePath as string) })
    }
    for (const addPath of keys(add)) {
        const value = add[addPath]
        patch.push({ op: "add", path: "/" + (addPath as string), value })
    }
    return patch
}

export default compareObjects
