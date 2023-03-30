<template>
  <div>
    <h1>Demo</h1>
    <RedDataTable
      v-model="rowSelected"
      :alternate-rows="options.alternateRows"
      :column-chooser="options.columnChooser"
      :column-resizing="options.columnResizing"
      :disable-pagination="options.disablePagination"
      :disable-sorting="options.disableSorting"
      :headers="headers"
      :fixed-header="options.fixedHeader"
      :height="options.height"
      :items="items"
      :items-per-page="Number(options.itemsPerPage)"
      :search="search"
      :select-row="options.selectRow"
      :show-borders="options.showBorders"
      :show-column-lines="options.showColumnLines"
      :show-row-lines="options.showRowLines"
    >
      <template #top>
        <div class="form-control">
          <input
            v-model="search"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            placeholder="Search"
            type="text"
          />
          <button
            type="button"
            @click.prevent="search=''"
          >Clear</button>
        </div>
        <br />
      </template>
    </RedDataTable>

    <br /><br /><br />

    <div class="options-panel">
      <h2>Options</h2>
      <table width="100%">
        <tr valign="top">
          <td width="50%">
            <div class="options-control options-control-checkbox">
              <label><input type="checkbox" v-model="options.alternateRows" /> Alternate rows</label>
            </div>
            <div class="options-control options-control-checkbox">
              <label><input type="checkbox" v-model="options.columnChooser" /> Column chooser</label>
            </div>
            <div class="options-control options-control-checkbox">
              <label><input type="checkbox" v-model="options.columnResizing" /> Column resizing</label>
            </div>
            <div class="options-control options-control-checkbox">
              <label><input type="checkbox" v-model="options.disablePagination" /> Disable pagination</label>
            </div>
            <div class="options-control options-control-checkbox">
              <label><input type="checkbox" v-model="options.disableSorting" /> Disable sorting</label>
            </div>
            <div class="options-control options-control-checkbox">
              <label><input type="checkbox" v-model="options.fixedHeader" /> Fixed header</label>
            </div>
            <div class="options-control options-control-checkbox">
              <label><input type="checkbox" v-model="options.showBorders" /> Show borders</label>
            </div>
            <div class="options-control options-control-checkbox">
              <label><input type="checkbox" v-model="options.showColumnLines" /> Show column lines</label>
            </div>
            <div class="options-control options-control-checkbox">
              <label><input type="checkbox" v-model="options.showRowLines" /> Show row lines</label>
            </div>
          </td>
          <td width="50%">
            <div class="options-control options-control-input">
              <label>Items per page:</label>
              <input type="number" min="0" max="1000" v-model="options.itemsPerPage" />
            </div>
            <div class="options-control options-control-input">
              <label>Row select:</label>
              <select v-model="options.selectRow">
                <option value="none">None</option>
                <option value="single">Single</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>
            <div class="options-control options-control-input">
              <label>Height:</label>
              <input type="text" min="0" max="1000" v-model="options.height" />
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { RedDataTableHeader } from 'types/red-data-table'

import RedDataTable from '@/components/RedDataTable'

const options = reactive({
  alternateRows: false,
  columnChooser: true,
  columnResizing: true,
  disablePagination: false,
  disableSorting: false,
  fixedHeader: false,
  height: undefined,
  itemsPerPage: 5,
  selectRow: 'none',
  showBorders: false,
  showColumnLines: false,
  showRowLines: false
})
const rowSelected = ref([])
const search = ref<string>('')
const headers = ref<RedDataTableHeader[]>([])
const items = ref<any>([]) // eslint-disable-line

watch(rowSelected, (value) => {
  console.log(value)
})

headers.value = [
  {
    text: 'Dessert (100g serving)',
    align: 'left',
    sortable: true,
    value: 'name'
  },
  {
    text: 'Calories',
    value: 'calories',
    sortable: true,
    align: 'right'
  },
  {
    text: 'Fat (g)',
    value: 'fat',
    sortable: true,
    align: 'right'
  },
  {
    text: 'Carbs (g)',
    value: 'carbs',
    align: 'right'
  },
  {
    text: 'Protein (g)',
    value: 'protein',
    align: 'right',
    hidden: true
  },
  {
    text: 'Iron (%)',
    value: 'iron',
    sortable: true,
    align: 'center',
    width: 180
  }
]
items.value = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: 1
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: 1
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: 7
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: 8
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: 16
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: 0
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: 2
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: 45
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: 22
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: 6
  }
]
// items.value = [[1, 2, 3, 4, 5, 6]]
</script>

<style lang="scss" scoped>
.form-control {
  box-sizing: border-box;
  display: flex;
  width: 300px;
  border: 1px solid #ccc;
  input {
    box-sizing: border-box;
    padding: 6px;
    display: block;
    width: 100%;
    height: 34px;
    border: 0;
    background-color: transparent;
    outline: 0;
    font-family: inherit;
    font-size: 16px;
  }
  button {
    border: 0;
    background-color: transparent;
    height: 34px;
    font-family: inherit;
    font-size: 12px;
    &:hover {
      background-color: #dedede;
    }
  }
}
.options-panel {
  background-color: #fafafa;
  padding: 6px;
  h2 {
    margin: 0 0 10px 0;
  }
  table tr td {
    padding: 0;
  }
  .options-control {
    margin-bottom: 12px;
    &.options-control-checkbox label {
      margin-right: 6px
    }
    &.options-control-input {
      height: 22px;
      label {
        float: left;
        width: 40%
      }
      input, select {
        float: left;
        min-width: 150px;
      }
    }
  }
}
</style>
