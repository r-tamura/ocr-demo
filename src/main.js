/* @flow */
import Rx from 'rx-lite'
import { scanEntry } from './fileutils'
import { recognize } from './ocr'
import { createProgressBar } from './view'

function blockEventPropagation(event) {
  event.stopPropagation()
  event.preventDefault()
}

function activateDropZone(zone: HTMLElement, activate = false) {
  zone.classList.toggle('dropzone--active', activate)
}

const dropZone = document.getElementById('dropzone')
Rx.Observable.fromEvent(dropZone, 'dragover')
  .subscribe(e => {
    blockEventPropagation(e)
    e.dataTransfer.dropEffect = 'copy'
  })

// "dragleave"イベントが子要素で発火する問題の対応策
// 1. カウンター方式
// 2. pointer-events: none;方式 (子要素でイベントが不必要な場合)
const plus = Rx.Observable.fromEvent(dropZone, 'dragenter').map(1)
const minus = Rx.Observable.fromEvent(dropZone, 'dragleave').map(-1)
const drop = Rx.Observable.fromEvent(dropZone, 'drop')
const source = plus.merge(minus).merge(drop.map(null))
source.scan((acc, v) => (v === null ? 0 : acc + v), 0)
  .subscribe(count => {
    activateDropZone(dropZone, count !== 0)
  })

const dropClick = Rx.Observable.fromEvent(dropZone, 'click')
dropClick
  .subscribe(e => {
    const hiddenId = e.target.getAttribute('data-link')
    const action = new Event('click')
    const hidden = document.getElementById(hiddenId)
    if (hidden) {
      hidden.dispatchEvent(action)
    }
  })

const updateProgressBar = ($bar, cur, max) => {
  const $text = $bar.querySelector('.load-indicator__text')
  $text.innerHTML = `Processing ... (${cur} / ${max})`
}

const resultList: HTMLElement = document.getElementById('result-list')
const hiddenFile: HTMLElement = document.getElementById('hidden-file')
const fileChange = Rx.Observable.fromEvent(hiddenFile, 'change')
drop.merge(fileChange).subscribe(async e => {
  blockEventPropagation(e)
  activateDropZone(e.currentTarget, false)

  let allFiles
  if (e.dataTransfer) {
    const items = Array.from(e.dataTransfer.items)
    const entries = items.map(i => i.webkitGetAsEntry())
    allFiles = await Promise.all(entries.map(scanEntry))
  } else {
    allFiles = Array.from(e.target.files)
  }

  const processCount = allFiles.length

  // 画像認識
  const process = recognize(allFiles, 'eng')
    .flatMap(p => Rx.Observable.fromPromise(p))

  const $processing: HTMLElement = document.createElement('li')
  $processing.innerHTML = `
    <div class="load-indicator">
      <div class="load-indicator__slide">
        <span class="load-indicator__text">
          Processing... (0 / ${processCount})
        </span>
      </div>
    </div>
  `
  resultList.appendChild($processing)

  process
    .map(1)
    .scan((acc, v) => acc + v, 0)
    .subscribe(v => updateProgressBar($processing, v, processCount))

  const words = await process.toArray().toPromise()

  const $link = document.createElement('a')
  $link.classList.add('button')
  const filename = `ocr-${new Date().getTime()}.txt`
  $link.innerHTML = `download (${filename})`
  $link.addEventListener('click', (ev: Event) => {
    Rx.Observable.from(words)
      .flatMap(x => Rx.Observable.from(x))
      .scan((acc, v) => (acc === '' ? v : `${acc}\r\n${v}`), '')
      .takeLast(1)
      .subscribe(txt => {
        const data = new Blob([txt], { type: 'text/plain' })
        const url = URL.createObjectURL(data)
        $link.href = url
        $link.download = filename
      })
  })
  const $li = document.createElement('li')
  $li.appendChild($link)
  resultList.removeChild($processing)
  resultList.appendChild($li)

})
