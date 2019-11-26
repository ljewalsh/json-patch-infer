import test from "ava"

import compareObjects from "../"

test("Can tell when an add operation has been added to the right-hand patch", (t) => {
    const objectOne = {}
    const objectTwo = { foo: "bar" }

    const diff = compareObjects(objectOne, objectTwo)

    t.deepEqual(diff, [{ op: "add", path: "/foo", value: "bar" }])
})
