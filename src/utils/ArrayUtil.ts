export default class ArraysUtil {
  static flatMapTree = (data: Array<any>, propertyFlat: string) => {
    return data.flatMap(obj => {
      const arrayMap = [obj]
      if (obj[propertyFlat]) {
        const perIds = ArraysUtil.flatMapTree(obj[propertyFlat], propertyFlat)

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
  static formatTreeData = (data: Array<any>, root: any) => {
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

  static sliceArray = (array: Array<any>, startIndex?: number, endIndex?: number) => {
    return window._.slice(array, startIndex, endIndex)
  }
}

