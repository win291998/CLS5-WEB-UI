import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Second page',
    to: { name: 'second-page' },
    icon: { icon: 'tabler-file' },
  },
  {
    title: 'Guilde',
    icon: { icon: 'tabler-file' },
    children: [
      { title: 'table', to: 'guilde-table' },
      { title: 'tree', to: { name: 'guilde-tree' } },
      { title: 'treeSelect', to: { name: 'guilde-tree-select' } },
    ],
  },
] as VerticalNavItems
