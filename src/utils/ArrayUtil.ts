const A = [1, 2]
const B = [1, 2, 4]
export const checkChildArray = (arrayChild: Array<any>, arrayParent: Array<any>) => window._.isEqual(window._.intersection(arrayChild, arrayParent), arrayChild)
console.log(checkChildArray(A, B))
