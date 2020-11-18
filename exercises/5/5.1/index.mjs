import { promisify } from "util"

const sleep = promisify(setTimeout)

async function promiseAll(promises) {
  const promisesMap = new Map(
    promises.map((promise, index) => [index, promise]),
  )
  const resultMap = new Map()

  return new Promise(async (resolve) => {
    promisesMap.forEach(async (promise, key) => {
      resultMap.set(key, await promise)

      if (resultMap.size === promisesMap.size) {
        resolve(
          Array.from(
            [...resultMap.entries()].sort().map(([_key, value]) => value),
          ),
        )
      }
    })
  })
}

console.time("Resolved in")
const resolvedPromises = await promiseAll([
  new Promise(async (resolve) => {
    await sleep(1000)
    resolve("First Promise resolved.")
  }),
  new Promise(async (resolve) => {
    await sleep(500)
    resolve("Second Promise resolved.")
  }),
  new Promise(async (resolve) => {
    await sleep(1500)
    resolve("Third Promise resolved.")
  }),
])
console.timeEnd("Resolved in")

resolvedPromises.map((resolvedPromise) => console.log(resolvedPromise))
