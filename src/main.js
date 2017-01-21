/* @flow */
// "dragleave"イベントが子要素で発火する問題の対応策
// 1. カウンター方式
// 2. pointer-events: none;方式 (子要素でイベントが不必要な場合)
let dragCounter = 0

function blockEventPropagation(event) {
  event.stopPropagation()
  event.preventDefault()
}

function activateDropZone(zone: HTMLElement, activate = false) {
  zone.classList.toggle('dropzone--active', activate)
}

const dropZone = document.getElementById('dropzone')
dropZone.addEventListener('dragover', e => {
  blockEventPropagation(e)
  e.dataTransfer.dropEffect = 'copy'
})

dropZone.addEventListener('dragenter', e => {
  dragCounter += 1
  activateDropZone(e.currentTarget, true)
})

dropZone.addEventListener('dragleave', e => {
  dragCounter -= 1
  if (dragCounter === 0) {
    activateDropZone(e.currentTarget, false)
  }
})

dropZone.addEventListener('drop', e => {
  dragCounter = 0
  blockEventPropagation(e)
  activateDropZone(e.currentTarget, false)
})
