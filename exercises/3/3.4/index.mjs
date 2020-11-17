import { EventEmitter } from "events"
import { nextTick } from "process"

const DivisibleBy5Error = new Error("Timestamp divisible by 5.")

function ticker(number, callback) {
  const emitter = new EventEmitter()

  recursion(number, emitter, 1, callback)

  return emitter
}

function recursion(number, emitter, ticks, callback) {
  if (Date.now() % 5 === 0) {
    nextTick(() => emitter.emit("error", DivisibleBy5Error))
    return callback(DivisibleBy5Error, ticks)
  }

  if (number <= 0) {
    return callback(null, ticks)
  }

  nextTick(() => emitter.emit("tick"))

  setTimeout(() => recursion(number - 50, emitter, ticks + 1, callback), 50)
}

ticker(1000, (err, ticks) => {
  if (err) {
    console.error(err)
  }
  console.log(`Emitted ${ticks} ${ticks > 1 ? "ticks" : "tick"}.`)
})
  .on("tick", () => console.log("Tick"))
  .on("error", console.error)
