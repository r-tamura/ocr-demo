import Tesseract from 'tesseract.js'
import Rx from 'rx-lite'

export function recognize(files, options): Array<Rx.Observable> {
  return Rx.Observable.from(files.map(file =>
    new Promise((resolve, reject) => {
      Tesseract.recognize(file, options)
        .then(result => resolve(result.words.map(w => w.text)))
        .catch(err => reject(err))
    }),
  ))
}
