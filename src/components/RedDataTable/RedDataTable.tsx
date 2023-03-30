/* eslint-disable @typescript-eslint/no-explicit-any */

// Generals
import { defineComponent, reactive, ref, watch } from 'vue'
import type { PropType, VNode } from 'vue'
import { RedDataTableHeader, RedDataTableSortColumnData } from 'types/red-data-table'

// Utilities
import { convertToUnit, getType, calcPageCount, getObjectValueByPath } from './utils/helpers'

// Components
import RedDataTableHeaders from './RedDataTableHeaders'
import RedDataTablePagination from './RedDataTablePagination'
import RedDataTableColumnChooser from './RedDataTableColumnChooser'

export default defineComponent({
  name: 'RedDataTable',

  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    alternateRows: {
      type: Boolean,
      default: false
    },
    columnChooser: {
      type: Boolean,
      default: true
    },
    columnResizing: {
      type: Boolean,
      default: true
    },
    disablePagination: {
      type: Boolean,
      default: false
    },
    disableSorting: {
      type: Boolean,
      default: false
    },
    fixedHeader: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array as PropType<RedDataTableHeader[]>,
      default: () => []
    },
    height: [Number, String],
    iconCheckBoxOff: String,
    iconCheckBoxOn: String,
    iconColumnChooser: String,
    iconPagePrev: String,
    iconPageNext: String,
    iconSortAsc: String,
    iconSortDesc: String,
    items: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    itemsPerPageOptions: Array as PropType<number[]>,
    page: {
      type: Number,
      default: 1
    },
    search: String,
    selectRow: {
      type: String,
      default: 'none',
      validator: (value: string) => ['none', 'single', 'multiple'].includes(value)
    },
    showBorders: {
      type: Boolean,
      default: false
    },
    showColumnLines: {
      type: Boolean,
      default: false
    },
    showRowLines: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue', 'rowClick'],

  setup (props, { emit, slots }) {
    const data = reactive({
      disablePagination: Boolean(props.disablePagination),
      items: [] as any[],
      itemsCount: props.items.length,
      itemsPerPage: Number(props.itemsPerPage),
      headers: [] as RedDataTableHeader[],
      headersSelector: [] as string[],
      page: Number(props.page),
      pageCount: calcPageCount(props.items.length, Number(props.itemsPerPage)),
      selectedItems: [] as string[]
    })
    const tableHead = ref<VNode>()
    const tableBody = ref<VNode>()
    const pagination = ref<VNode>()

    const defaultFilter = (value: any, search: string | null): boolean => {
      return value !== null
        && search !== null
        && getType(value) !== 'boolean'
        && value.toString().toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1
    }

    const setHeaders = (headers: RedDataTableHeader[]): void => {
      if (headers && headers.length) {
        const th: RedDataTableHeader[] = []
        const ths: string[] = []
        headers.forEach((header: RedDataTableHeader) => {
          if (header.hidden !== true) {
            th.push(header)
            ths.push(header.value)
          }
        })
        data.headers = th
        data.headersSelector = ths
      }
    }

    const setItems = (search = ''): void => {
      let items = [...props.items]
      if (!['array', 'object'].includes(getType(items[0]))) {
        items = []
      }
      if (search) {
        search = search.toString().toLocaleLowerCase()
        if (search.trim() !== '') {
          items = items.filter((item: any) =>
            Object.keys(item).some((key) => defaultFilter(getObjectValueByPath(item, key), search))
          )
        }
      }
      data.items = [...items]
    }

    const selectedItemsExists = (item: any): boolean => {
      return data.selectedItems.includes(JSON.stringify(item))
    }

    const rowClick = (e: MouseEvent | TouchEvent, item: any): void => {
      let _selectedItems = [...data.selectedItems]
      if (props.selectRow !== 'none') {
        const index = JSON.stringify(item)
        if (_selectedItems.includes(index)) {
          _selectedItems = _selectedItems.filter(idx => idx !== index)
        } else {
          if (props.selectRow === 'single') {
            _selectedItems = []
          }
          _selectedItems.push(index)
        }
        data.selectedItems = _selectedItems
        emit('update:modelValue', _selectedItems.map(item => JSON.parse(item)))
        emit('rowClick', e, {
          item: item,
          isSelected: selectedItemsExists(item)
        })
      }
    }

    const renderTable = (
      items: any[],
      headers: RedDataTableHeader[],
      itemsPerPage: number,
      page: number
    ): void => {
      // Table Head
      tableHead.value = (<RedDataTableHeaders
        v-slots={slots}
        columnResizing={Boolean(props.columnResizing)}
        disableSorting={Boolean(props.disableSorting)}
        headers={headers}
        iconSortAsc={props.iconSortAsc}
        iconSortDesc={props.iconSortDesc}
        onSortColumn={(sortData: RedDataTableSortColumnData) => {
          let _items = [...items]
          switch (sortData.direction) {
            case 'ascending':
              _items = _items.sort((i1, i2) => i1[sortData.sort] > i2[sortData.sort] ? 1 : -1)
              break
            case 'descending':
              _items = _items.sort((i1, i2) => i1[sortData.sort] < i2[sortData.sort] ? 1 : -1)
              break
            default:
              _items = props.items
              break
          }
          data.items = _items
        }}
      />)
      // Filter items
      let _items = [...items]
      if (itemsPerPage > 0) {
        _items = _items.slice((page - 1) * itemsPerPage, itemsPerPage * page)
      }
      // Table Body
      let tbody: VNode[] = []
      switch (getType(_items[0])) {
        case 'array':
          _items.forEach((item: any, itemIndex: number) => {
            tbody.push(<tr
              aria-rowindex={itemIndex + 1}
              class={selectedItemsExists(item) ? 'row-active' : undefined}
              role={'row'}
              onClick={(e: MouseEvent | TouchEvent) => {
                e.preventDefault()
                rowClick(e, item)
              }}
            >
              {item.map((val: any, index: number) => (<td
                aria-describedby={`rdt-col-${index + 1}`}
                aria-colindex={index + 1}
                role={'cell'}
                tabindex={0}
              >
                {slots[`item.${index}`] ? (slots[`item.${index}`]?.({ value: val, row: item })) : val}
              </td>))}
            </tr>)
          })
          break
        case 'object':
          _items.forEach((item: any, itemIndex: number) => {
            tbody.push(<tr
              aria-rowindex={itemIndex + 1}
              class={selectedItemsExists(item) ? 'row-active' : undefined}
              role={'row'}
              onClick={(e: MouseEvent | TouchEvent) => {
                e.preventDefault()
                rowClick(e, item)
              }}
            >
              {headers.filter((header: RedDataTableHeader) => header.value in item)
                .map((header: RedDataTableHeader, index: number) => (<td
                  aria-describedby={`rdt-col-${index + 1}`}
                  aria-colindex={index + 1}
                  class={[`align-${header.align || 'left'}`, header.itemClass]}
                  role={'cell'}
                  tabindex={0}
                >
                  {slots[`item.${header.value}`]
                    ? (slots[`item.${header.value}`]?.({ value: getObjectValueByPath(item, header.value), header: header, row: item }))
                    : getObjectValueByPath(item, header.value)}
                </td>))}
            </tr>)
          })
          break
        default:
          tbody = []
          tbody.push(<tr role={'row'}>
            <td
              class={'align-center'}
              colspan={headers.length || undefined}
              role={'cell'}
              tabindex={0}
            >No data</td>
          </tr>)
          break
      }
      tableBody.value = (<tbody role={'rowgroup'}>{tbody}</tbody>)
    }

    const renderPagination = (
      disablePagination: boolean,
      itemsCount: number,
      itemsPerPage: number,
      page: number
    ): void => {
      pagination.value = Boolean(disablePagination) === true
        ? undefined
        : (<RedDataTablePagination
          iconPagePrev={props.iconPagePrev}
          iconPageNext={props.iconPageNext}
          itemsCount={itemsCount}
          itemsPerPage={itemsPerPage}
          page={page}
          onUpdate={(value: Record<string, number>) => {
            data.pageCount = value.pageCount
            data.page = value.page
            data.itemsPerPage = value.itemsPerPage
          }}
        />)
    }

    // Props change
    watch([
      () => props.columnResizing,
      () => props.disablePagination,
      () => props.disableSorting,
      () => props.headers,
      () => props.items,
      () => props.itemsPerPage,
      () => props.search
    ], (value) => {
      data.disablePagination = Boolean(value[1])
      data.itemsPerPage = data.disablePagination ? 0 : Number(value[5])
      setHeaders(value[3])
      setItems(value[6])
    })

    // Calculate and render
    watch(data, (value) => {
      data.itemsCount = value.items.length
      renderTable(value.items, value.headers, value.itemsPerPage, value.page)
      renderPagination(data.disablePagination, value.itemsCount, value.itemsPerPage, value.page)
    })

    // Table Headers
    setHeaders(props.headers)

    // Table Items
    setItems()

    return () => {
      return (
        <div
          aria-label={'Red Data Grid'}
          class={[
            'red-data-table',
            {
              'red-data-table--alternate-rows': props.alternateRows,
              'red-data-table--borders': props.showBorders,
              'red-data-table--borders-rows': props.showRowLines,
              'red-data-table--borders-columns': props.showColumnLines,
              'red-data-table--resize': props.columnResizing,
              'red-data-table--fixed-header': props.fixedHeader,
              'red-data-table--has-top': !!slots.top,
              'red-data-table--has-bottom': !!slots.bottom
            }
          ]}
          role={'presentation'}
        >
          <div class={['red-data-table__slot-top']} role={'presentation'}>
            <div class={['red-data-table__slot-top--left']} role={'presentation'}>{slots.top?.()}</div>
            <div class={['red-data-table__slot-top--right']} role={'presentation'}>
              {Boolean(props.columnChooser) === true
                ? (<RedDataTableColumnChooser
                    headers={props.headers}
                    headersSelector={data.headersSelector}
                    iconCheckBoxOff={props.iconCheckBoxOff}
                    iconCheckBoxOn={props.iconCheckBoxOn}
                    iconColumnChooser={props.iconColumnChooser}
                    onSelectedHeaders={(items: string[]) => {
                      let headers: RedDataTableHeader[] = []
                      items.forEach((val: string) => {
                        const header = props.headers.find(item => item.value === val)
                        if (header) {
                          headers.push(header)
                        }
                      })
                      headers = headers.sort((h1: RedDataTableHeader, h2: RedDataTableHeader) => {
                        return props.headers.findIndex(item => item.value === h1.value)
                          - props.headers.findIndex(item => item.value === h2.value)
                      })
                      data.headers = headers
                      data.headersSelector = items
                    }}
                  />)
                : ''}
            </div>
          </div>
          <div
            class={['red-data-table__wrapper']}
            role={'table'}
            style={{
              height: convertToUnit(props.height)
            }}
          >
            <table role={'presentation'}>
              {tableHead.value}
              {tableBody.value}
            </table>
          </div>
          {pagination.value}
          {slots.bottom?.()}
        </div>
      )
    }
  }
})
