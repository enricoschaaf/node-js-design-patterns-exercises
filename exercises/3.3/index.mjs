import { EventEmitter } from "events"

function ticker(number, callback) {
  const emitter = new EventEmitter()

  nextTick(() => emitter.emit("tick"))

  recursion(number, emitter, 1, callback)

  return emitter
}

function recursion(number, emitter, ticks, callback) {
  if (number <= 0) {
    return callback(null, ticks)
  }

  setTimeout(() => {
    emitter.emit("tick")
    return recursion(number - 50, emitter, ticks + 1, callback)
  }, 50)
}

ticker(1000, (_err, ticks) =>
  console.log(`Emitted ${ticks} ${ticks > 1 ? "ticks" : "tick"}.`),
).on("tick", () => console.log("Tick"))
