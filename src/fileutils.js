/**
 * File and Directory Entries API 関連の汎用API
 *  - 基本APIがコールバック主体なので、Promiseベースとなるようwrap
 */

/**
 * FileSystemFileEntryオブジェクトからFileオブジェクトを生成
 */
export const createFile = async entry =>
  new Promise((resolve, reject) => {
    entry.file(file => resolve(file), err => reject(err))
  })

/**
 *  FileSystemEntryを再帰的に走査し、Fileオブジェクトを取得
 */
export const scanEntry = async (entry: FileSystemEntry) => {
  // ファイルの場合
  if (entry.isFile) {
    return createFile(entry)
  }

  // ディレクトリの場合: 再帰的な走査
  return new Promise((resolve, reject) => {
    const reader = entry.createReader()
    reader.readEntries(async entries => {
      const results = await Promise.all(entries.map(scanEntry))
      resolve(results.reduce((pv, cv) => {
        cv = Array.isArray(cv) ? cv : [cv]
        return [...pv, ...cv]
      }, []))
    })
  }, err => reject(err))
}
