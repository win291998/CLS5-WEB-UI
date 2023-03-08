import { Ref } from "vue";
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
//Cài đặt cố định
declare global {
  interface Window extends propertyGlobal {
    //định nghĩa các property custom ở window
  }
}

// Khai báo các biến dùng global
interface propertyGlobal {
  //reactive
  reactive1?: number,
  reactive2?: Ref<string>,
  token?: Ref<string>,
  _?: _.LoDashStatic,
  i18n?: any,
  //const
  const1?:  any,
  const2?: number,
}

//Định nghĩa biến toàn cục (reactvie) có thể thay đổi dữ liệu
const windowDefineReactiveProperty = (app: any)=> {
  const global: propertyGlobal = {
    reactive1: 555, // biến không phản ứng
    reactive2: ref('react'), // khai báo ref để biến có thể phản ứng
    token: ref(''), 
  }
  defineProperty(global, 'react')
}
//Định nghĩa biến toàn cục (const) không thể thay đổi dữ liệu
const windowDefineConstProperty = ()=> {
  const global: propertyGlobal = {
    const1: 555,
    const2: 123,
    _: _,
    i18n: useI18n
  }
  defineProperty(global, 'const')
}

//xử lý việc có được phép thay đổi global
const defineProperty = (property: object, type: string) => {
  //register global
  _.forEach(property, (valueProperty: any, key: any)=> {
    window[key] = valueProperty
    Object.defineProperty(window, key, {
      value: valueProperty,
      writable: type === 'react'
    });
  })
}

// đăng ký với app
const windowDefineProperty=(app: any)=> {
  windowDefineReactiveProperty(app)
  windowDefineConstProperty()
}
console.log(window);

export default windowDefineProperty
