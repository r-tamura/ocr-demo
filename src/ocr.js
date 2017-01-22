import Tesseract from 'tesseract.js'
import Rx from 'rx-lite'

export function recognize(files, options) {
  const fileNum = files.length
  let count = 0
  const allProcesses = files.map(file =>
    new Promise((resolve, reject) => {
      Tesseract.recognize(file, options)
        .then(result => {
          console.log(`${++count}/${fileNum}`)
          resolve(result.words.map(w => w.text))
        })
        .catch(err => {
          reject(err)
        })
    }),
  )

  return Promise.all(allProcesses)
}
