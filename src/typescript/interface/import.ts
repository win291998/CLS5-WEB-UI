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
export interface Config {
  dowloadSample?: DowloadSample
  importFile?: ImportFile
}

