import { readFile, writeFile } from "fs/promises"

async function concatFiles(srcFiles, destFile, cb) {
  const files = await Promise.all(srcFiles.map((path) => readFile(path)))
  await writeFile(destFile, files.join(""))
  cb()
}

concatFiles(["foo", "bar"], "foobar", () =>
  console.log("Files successfully concatenated."),
)
