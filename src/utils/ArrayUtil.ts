export const checkChildArray = (arrayChild: Array<any>, arrayParent: Array<any>) => window._.isEqual(window._.intersection(arrayChild, arrayParent), arrayChild)

/**
 * @description: Làm phẳng mảng với thuộc tính cần làm phẳng
 * @param {Array<any>} data  => mảng cần làm phẳng
 * @param {string} propertyFlat => thuộc tính muốn làm phẳng trong mảng
 * @returns
 */
export const flatMapTree = (data: Array<any>, propertyFlat: string) => {
  return data.flatMap(obj => {
    const arrayMap = [obj]
    if (obj[propertyFlat]) {
      const perIds = flatMapTree(obj[propertyFlat], propertyFlat)

      arrayMap.push(...perIds)
    }

    return arrayMap
  })
}

/**
 *
 * @param data
 * @returns
 */
export const formatTreeData = (data: Array<any>, root: any) => {
  return data.reduce((object, permiss) => {
    const { permissions, ...rest } = permiss // loại bỏ permissions ra khỏi object

    object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`] = rest
    object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`].ids = permiss.id
    object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`].text = object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`].name

    object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`].permission = permiss.permissionValue
    object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`].orgPermission = permiss.orgPermissionValue
    object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`].permissionValue = 0
    object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`].orgPermissionValue = 0
    if (root.includes(`node-${permiss.orgId ? permiss.orgId : permiss.id}`)) {
      object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`].state = {
        opened: true,
      }
    }

    if (permiss.permissions?.length)
      object[`node-${permiss.orgId ? permiss.orgId : permiss.id}`].children = permiss.permissions?.map((item: any) => `node-${item.orgId ? item.orgId : item.id}`)

    return object
  }, {})
}
