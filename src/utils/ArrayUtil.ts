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

  static checkParentNode = (parent: any, objChild: any, obj: any, key: string) => {
    if (parent.parent) {
      objChild.parent.parent = { [key]: parent.parent[key] }
      obj.level++
      ArraysUtil.checkParentNode(parent.parent, objChild.parent, obj, key)
    }
  }

  static formatTreeTable = (items: Array<any>, key: string) => {
    const result: any = []

    window._.transform(items, (acc, obj: any) => {
      const parent = acc.find((item: any) => item.children && item.children.find((child: any) => child[key] === obj[key]))

      obj.level = 0
      if (parent) {
        obj.parent = { [key]: parent[key] }
        obj.level++
        ArraysUtil.checkParentNode(parent, obj, obj, key)
      }
      acc.push(obj)

      return acc
    }, result)

    return result
  }
}

