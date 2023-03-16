import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Home',
    to: { name: 'user' },
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
      { title: 'tableGroup', to: { name: 'guilde-table-group' } },
      { title: 'tree', to: { name: 'guilde-tree' } },
      { title: 'treeSelect', to: { name: 'guilde-tree-select' } },
      { title: 'importFile', to: { name: 'guilde-import-file' } },
    ],
  },
] as VerticalNavItems
