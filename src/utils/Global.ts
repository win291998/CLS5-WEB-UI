export const setWindowDefineProperty = (key: string, value: any) => {
  window[key as never] = value
}
