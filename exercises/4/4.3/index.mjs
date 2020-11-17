import { readdir, readFile } from "fs/promises"
import { basename, join } from "path"

async function recursiveFind(dir, keyword, cb) {
  const files = await recursion(dir, keyword, 10)
  cb(files.flat(Infinity))
}

async function recursion(dir, keyword, parallelism) {
  try {
    const nestedFiles = await readdir(dir)

    const chunks = nestedFiles.reduce((acc, _, index, src) => {
      if (index % parallelism) return acc
      return [...acc, src.slice(index, index + parallelism)]
    }, [])

    const allMatches = await new Promise((resolve) => {
      chunks.map(async (chunk) => {
        const matches = await Promise.all(
          chunk.map((nestedFile) =>
            recursion(join(dir, nestedFile), keyword, parallelism),
          ),
        )
        resolve(matches)
      })
    })
    return allMatches.flat().filter((match) => match)
  } catch (err) {
    if (err.code === "ENOTDIR") {
      const file = await readFile(dir)
      if (file.toString().includes(keyword)) {
        return basename(dir)
      }
    }
  }
}

recursiveFind("myDir", "batman", console.log)
