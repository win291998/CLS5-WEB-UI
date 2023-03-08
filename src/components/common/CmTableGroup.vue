<script>
export default {
  data() {
    return {
      level1Items: [
        {
          id: 1,
          name: 'Item 1',
          children: [
            {
              id: 2,
              name: 'Item 1.1',
              children: [
                {
                  id: 3,
                  name: 'Item 1.1.1',
                  children: [
                    {
                      id: 4,
                      name: 'Item 1.1.1.1',
                      children: [],
                    },
                    {
                      id: 5,
                      name: 'Item 1.1.1.2',
                      children: [],
                    },
                  ],
                },
                {
                  id: 6,
                  name: 'Item 1.1.2',
                  children: [],
                },
              ],
            },
            {
              id: 7,
              name: 'Item 1.2',
              children: [],
            },
          ],
        },
        {
          id: 8,
          name: 'Item 2',
          children: [
            {
              id: 9,
              name: 'Item 2.1',
              children: [],
            },
          ],
        },
      ],
    }
  },
  methods: {
    countChildren(item) {
      // Đếm số lượng con của một item
      if (item.children && item.children.length > 0)
        return item.children.reduce((acc, child) => acc + this.countChildren(child), 1)

      else
        return 1
    },
  },
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Level 1</th>
        <th>Level 2</th>
        <th>Level 3</th>
        <th>Level 4</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="level1Item in level1Items"
        :key="level1Item.id"
      >
        <td>{{ level1Item.name }}</td>
        <td
          v-if="level1Item.children && level1Item.children.length > 0"
          :rowspan="countChildren(level1Item)"
        >
          <table>
            <tbody>
              <tr
                v-for="level2Item in level1Item.children"
                :key="level2Item.id"
              >
                <td>{{ level2Item.name }}</td>
                <td
                  v-if="level2Item.children && level2Item.children.length > 0"
                  :rowspan="countChildren(level2Item)"
                >
                  <table>
                    <tbody>
                      <tr
                        v-for="level3Item in level2Item.children"
                        :key="level3Item.id"
                      >
                        <td>{{ level3Item.name }}</td>
                        <td
                          v-if="level3Item.children && level3Item.children.length > 0"
                          :rowspan="countChildren(level3Item)"
                        >
                          <table>
                            <tbody>
                              <tr
                                v-for="level4Item in level3Item.children"
                                :key="level4Item.id"
                              >
                                <td>{{ level4Item.name }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>
