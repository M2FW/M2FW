import XLSX, { WorkBook, WorkSheet } from 'xlsx'

import { SupportingExtensions } from './constants'

export class ExImport {
  static export(fileName: string, data: Record<string, any>[], extType: SupportingExtensions): void {
    switch (extType) {
      case 'xlsx':
        this.exportXLSX(fileName, data)
        break

      case 'xls':
        this.exportXLS(fileName, data)
        break

      default:
        throw new Error(`The passed extension (${extType}) is not supported to export`)
    }
  }

  static exportXLSX(fileName: string, data: Record<string, any>[]): void {
    const wb: WorkBook = XLSX.utils.book_new()
    const ws: WorkSheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, fileName)
    XLSX.writeFile(wb, `${fileName}.xlsx`, { bookType: 'xlsx' })
  }

  static exportXLS(fileName: string, data: Record<string, any>[]): void {
    const wb: WorkBook = XLSX.utils.book_new()
    const ws: WorkSheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, fileName)
    XLSX.writeFile(wb, `${fileName}.xls`, { bookType: 'xls' })
  }

  static async import(extensionTypes: SupportingExtensions[] = ['xlsx', 'xls']): Promise<any> {
    return new Promise((resolve, reject) => {
      const input: HTMLInputElement = document.createElement('input')
      input.type = 'file'
      input.accept = extensionTypes.map((extType: SupportingExtensions) => `.${extType}`).join(',')
      input.multiple = false
      let result: any

      input.onchange = async (): Promise<any> => {
        try {
          if (!input.files?.length) {
            reject('File not selected')
          } else {
            const file: File = input.files[0]
            const extType: SupportingExtensions = file.name.substr(
              file.name.search(/\.\w+$/) + 1
            ) as SupportingExtensions

            switch (extType) {
              case 'xlsx':
                result = await this.importExcel(file)
                break

              case 'xls':
                result = await this.importExcel(file)
                break

              default:
                throw new Error(`The chosen file has extension (${extType}) which is not supported to import`)
            }
          }

          resolve(result)
        } catch (e) {
          reject(e)
        }
      }
      input.click()
    })
  }

  static async importExcel(file: File): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const fileReader: FileReader = new FileReader()
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        const arrayBuffer: string | ArrayBuffer | null | undefined = e.target?.result
        if (arrayBuffer && arrayBuffer instanceof ArrayBuffer) {
          const data: Uint8Array = new Uint8Array(arrayBuffer)
          const workBook: WorkBook = XLSX.read(data, { type: 'array' })

          const sheets: Record<string, any> = workBook.Sheets
          Object.keys(sheets).forEach((sheetName: string) => {
            sheets[sheetName] = XLSX.utils.sheet_to_json(sheets[sheetName])
          })

          resolve(sheets)
        }
      }
      fileReader.onerror = (e: ProgressEvent<FileReader>) => reject(e)

      fileReader.readAsArrayBuffer(file)
    })
  }
}
