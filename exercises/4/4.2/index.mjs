import { readdir } from "fs/promises"
import { basename, join } from "path"

async function listNestedFiles(dir, cb) {
  const files = await recursion(dir)
  cb(files.flat(Infinity))
}

async function recursion(dir) {
  try {
    const nestedFiles = await readdir(dir)
    return Promise.all(
      nestedFiles.map((nestedFile) => recursion(join(dir, nestedFile))),
    )
  } catch (err) {
    if (err.code === "ENOTDIR") {
      return basename(dir)
    }
  }
}

listNestedFiles("../..", console.log)
