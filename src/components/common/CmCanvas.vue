<script setup lang="ts">
import { LINE_HEIGHT_RATIOS } from '@/constant/Globals'
import QRCode from '@/typescript/ts/QRCode'

interface Size {
  width: number
  height: number
}
interface Format {
  color: string
  content: string
  fontFamily: string
  fontSize: number
  fontStyle: string
  fontWeight: number
  text: string
  textAlign: string
  textDecoration: string
  zIndex: number

}
interface Content {
  contentType: string
  format: Format
  hasFormatSupport: boolean
  isSelected: boolean
  height: number
  id: number | string
  scaleX: number
  scaleY: number
  type: string
  width: number
  x: number
  xx: number
  y: number
  yy: number
  [property: string]: any
}

interface Props {
  id: string
  message?: string
  background: string
  width: number
  height: number
  size?: Size | null
  content: Content[]
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  id: 'canvas',
  message: '',
  width: 1000,
  height: 640,
  background: '',
  size: null,
  content: () => ([]),
}))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const canvasRef = ref()
const elementCount = ref(-1)
const contentValue = ref()
const qrCode = ref()
const PADDING = 2
const SERVERFILE = window.SERVER_FILE || ''
function getDeviceRatio(ctx: any) {
  const dpr = window.devicePixelRatio || 1
  const bsr = ctx.webkitBackingStorePixelRatio
              || ctx.mozBackingStorePixelRatio
              || ctx.msBackingStorePixelRatio
              || ctx.oBackingStorePixelRatio
              || ctx.backingStorePixelRatio || 1
  return dpr / bsr
}
function drawCertification(context: any) {
  if (!context) {
    context = canvasRef.value.getContext('2d')
    context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    elementCount.value = -1
  }

  // sắp xếp lại vị trí child theo z-index
  contentValue.value?.sort((a: any, b: any) => a?.format?.zIndex - b?.format?.zIndex)

  drawBackground(context, contentValue.value, () => drawNextElement(context))
}
function drawNextElement(ctx: any) {
  elementCount.value += 1
  if (elementCount.value < contentValue.value.length) {
    const element = contentValue.value[elementCount.value]
    drawElement(ctx, element)
  }
  else {
    checkScaleCertificate()
  }
}
function drawElement(ctx: any, element: any) {
  switch (element.contentType) {
    case 'title':
      drawText(ctx, element)
      break
    case 'text':
      drawText(ctx, element)
      break
    case 'image':
      drawImage(ctx, element)
      break
    case 'shape':
      drawShape(ctx, element)
      break
    case 'qrcode':
      drawQRCode(ctx, element)
      break
    default:
      break
  }
}
function drawText(ctx: any, element: any) {
  ctx.save()
  element.format.fontFamily = element.format.fontFamily ? element.format.fontFamily : 'Montserrat, Helvetica, Arial, serif'
  element.format.fontSize = element.format.fontSize ? element.format.fontSize : 14
  ctx.font = `${element.format.fontStyle} ${element.format.fontWeight} ${element.format.fontSize}px ${element.format.fontFamily}`
  ctx.fillStyle = element.format.color
  ctx.textAlign = element.format.textAlign

  const startX = element.format.textAlign === 'left'
    ? (element.x + PADDING)
    : (element.format.textAlign === 'center' ? element.x + element.width / 2 : (element.x + element.width - PADDING))

  const metrics = ctx.measureText(element.format.content) // Xác định thông tin chiều cao thực sự của phông chữ
  const lineHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent // Chiều cao thực tế của phông chữ
  const lineHeightRatio = LINE_HEIGHT_RATIOS?.find(x => x.key === element.format.fontFamily)?.value || 0 // Lấy tỷ lệ khoảng cách giữa các dòng tính theo phông chữ của các phông
  const lines = fragmentText(ctx, element.format.content ? element.format.content.replace('[[', '').replace(']]', '') : '', element.width - PADDING * 2) // Tính toán lấy danh sách các dòng
  const numOfLines = element.contentType === 'title' ? 1 : lines.length
  const startY = element.y // Xác định điểm bắt đầu của nội dung văn bản, nội dung sẽ được căn chỉnh theo chiều dọc giống với thuộc tính justify-content: center,
      + (element.height - (numOfLines * lineHeight) - (numOfLines - 1) * lineHeightRatio * element.format.fontSize) / 2 // nó có giá trị bằng: tọa độ y của khung, cộng cho hiệu của chiều cao khung (chiều cao 1 dòng nhân tổng số dòng cộng khoảng cách giữa các dòng), chiều cao nội dung tất cả chia
  lines.forEach((line: any, i: number) => {
    const y = startY + (i + 1) * element.format.fontSize + i * (lineHeightRatio * element.format.fontSize)
    ctx.fillText(line, startX, y)
    if (element.format.textDecoration === 'underline' && element.format.content) {
      // Vẽ đường gạch chân
      const lineWidth = ctx.measureText(line).width
      const underlineY = y + 8
      const underlineX1 = startX - metrics.actualBoundingBoxLeft
      const underlineX2 = underlineX1 + lineWidth
      ctx.beginPath()
      ctx.strokeStyle = element.format.color
      ctx.lineWidth = element.format.fontWeight === 600 ? lineHeight * 0.075 : lineHeight * 0.05
      ctx.moveTo(underlineX1, underlineY)
      ctx.lineTo(underlineX2, underlineY)
      ctx.stroke()
    }
  })
  ctx.restore()
  drawNextElement(ctx)
}

// Vẽ hình chữ nhật
function drawShape(ctx: any, element: any) {
  ctx.save()
  ctx.fillStyle = element.format.color
  ctx.fillRect(element.x, element.y, element.width, element.height)
  ctx.restore()
  drawNextElement(ctx)
}

// Vẽ QRCode
function drawQRCode(ctx: any, element: any) {
  ctx.save()

  // this.qrCode.drawCanvas(ctx, element.format.content, {
  //   correctLevel: 0, x: element.x, y: element.y, width: element.width, height: element.height, colorDark: element.format.color ? element.format.color : 'black', colorLight: 'transparent',
  // })
  ctx.restore()
  drawNextElement(ctx)
}

// Vẽ hình ảnh
function drawImage(ctx: any, element: any) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = async () => {
    await ctx.drawImage(img, element.x, element.y, element.width, element.height)
    drawNextElement(ctx)
  }
  img.src = SERVERFILE + element.format.content
}

// Tính toán xác định các nội dung trên 1 dòng
function fragmentText(ctx: any, text: any, maxWidth: any) {
  const words = text.split(' ') // Tách các nội dung thành mảng các từ, các từ được quy định là sau mỗi khoảng trắng
  const lines = []
  let line = ''
  if (ctx.measureText(text).width < maxWidth) { // Nếu kích thước các nội dung nhỏ hơn kích thước tối đa cho phép vẽ thì không thực hiện tính toán nữa
    return [text]
  }
  while (words.length > 0) {
    while (ctx.measureText(words[0]).width >= maxWidth) {
      const tmp = words[0]
      words[0] = tmp.slice(0, -1)
      if (words.length > 1)
        words[1] = tmp.slice(-1) + words[1]

      else
        words.push(tmp.slice(-1))
    }
    if (ctx.measureText(line + words[0]).width < maxWidth) {
      line += `${words.shift()} `
    }
    else {
      lines.push(line)
      line = ''
    }
    if (words.length === 0)
      lines.push(line)
  }
  return lines
}
function drawBackground(ctx: any, data: any, drawItems: any) {
  if (props?.background) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(img, 0, 0, props.width, props.height)
      drawItems()
    }
    img.src = SERVERFILE + props?.background
    console.log(img.src)
  }
}
function checkScaleCertificate() {
  if (props.size?.width) {
    const differenceRatio = Math.min(props.size.width / props.width, props.size?.height / props.height)
    canvasRef.value.style.width = `${props.width * differenceRatio}px`
    canvasRef.value.style.height = `${props.height * differenceRatio}px`
    return
  }
  const { width } = props
  const { height } = props
  const differenceRatio = Math.max(width / 1000, height / 640)
  if (differenceRatio > 1) {
    canvasRef.value.style.width = `${props.width / differenceRatio}px`
    canvasRef.value.style.height = `${props.height / differenceRatio}px`
  }
}
watch(() => props.content, val => contentValue.value = val, { immediate: true })
function draw() {
  const context = canvasRef.value?.getContext('2d')
  console.log(context)

  if (props.size?.width) {
    const differenceRatio = Math.min(props.size?.width / props.width, props.size?.height / props.height)
    canvasRef.value.width = (props.width * differenceRatio)
    canvasRef.value.height = (props.height * differenceRatio)
    canvasRef.value.style.width = `${props.width * differenceRatio}px`
    canvasRef.value.style.height = `${props.height * differenceRatio}px`

    context.setTransform(differenceRatio, 0, 0, differenceRatio, 0, 0)
  }
  else {
    const ratio = getDeviceRatio(context)
    canvasRef.value.width = props.width * ratio
    canvasRef.value.height = props.height * ratio
    canvasRef.value.style.width = `${props.width}px`
    canvasRef.value.style.height = `${props.height}px`
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
  }
  context.save()
  qrCode.value = QRCode
  drawCertification(context)
}
onMounted(() => {
  console.log(canvasRef.value)
  draw()
})
defineExpose({
  canvasRef,
})
</script>

<template>
  <div
    id="my-certification"
    class="my-certification"
  >
    <canvas
      :id="id"
      ref="canvasRef"
    >
      <p>{{ t(message) }}</p>
    </canvas>
  </div>
</template>

<style lang="scss">
.my-certification {
  width: 100%;
  height: 100%;
}
</style>
