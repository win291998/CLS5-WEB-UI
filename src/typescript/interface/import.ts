// interface
export interface DowloadSample {
  urlFileDefault: string
  method: string
  paramsDowload?: object
  nameFile?: string
  dataColumnExcel(rowData: Array<any>): object
}
export interface ImportFile {
  paramsImport?: object
  urlFileDefault: string
  method: string
}
export interface tableImport {
  header: Array<any>
}
export interface Config {
  customId?: string
  routerBack?: string
  table: tableImport
  dowloadSample?: DowloadSample
  importFile?: ImportFile
}

