import Treeview from 'vue3-treeview'

export default function Tree() {
  const config = {
    roots: ['id1', 'id2'],
    checkboxes: true,
    dragAndDrop: true,
    editable: true,
  }

  const nodes = {
    id1: {
      text: 'text1',
      children: ['id11', 'id12'],
    },
    id11: {
      text: 'text11',
    },
    id12: {
      text: 'text12',
    },
    id2: {
      text: 'text2',
    },
  }

  const tf = null

  return <div onClick={() => console.log(tf)}>
    <Treeview
      nodes={nodes}
      config={config}
      ref={tf}
    />
  </div>
}
