import { defineComponent, reactive, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { RedDataTableHeader } from 'types/red-data-table'

// Utilities
import { convertToUnit } from './utils/helpers'

export default defineComponent({
  name: 'RedDataTableHeaders',

  props: {
    columnResizing: {
      type: Boolean,
      required: true,
      default: true
    },
    disableSorting: {
      type: Boolean,
      required: true,
      default: false
    },
    headers: {
      type: Array as PropType<RedDataTableHeader[]>,
      default: () => []
    },
    iconSortAsc: {
      type: String,
      default: 'rdt-font col-sort-asc'
    },
    iconSortDesc: {
      type: String,
      default: 'rdt-font col-sort-desc'
    }
  },

  emits: ['sortColumn'],

  setup (props, { emit, slots }) {
    const col = ref<Record<string, any>>({}) // eslint-disable-line

    // Page coordinates
    const getPageX = (e: MouseEvent | TouchEvent): number => {
      if (e instanceof MouseEvent) {
        return Math.floor(e.pageX)
      }
      return Math.floor(e.changedTouches[0].pageX)
    }

    // Header column attributes
    const headerColAttributesInit = (): Record<string, string> => {
      return {
        class: '',
        ariaSort: 'none'
      }
    }

    // Init headers
    watch(() => props.headers, (headers: RedDataTableHeader[]) => {
      headers.forEach((header: RedDataTableHeader) => {
        Object.assign(col.value, {
          [header.value]: headerColAttributesInit()
        })
      })
    }, {
      immediate: true
    })

    // Resize
    const resizeMinWidth = 90
    const resize = reactive({
      currentTh: null as HTMLElement | null,
      nextTh: null as HTMLElement | null,
      currentOffsetStart: 0,
      nextOffsetStart: 0
    })

    const setCurrentTh = (width: number): void => {
      if (resize.currentTh) {
        resize.currentTh.style.width = String(convertToUnit(width))
        resize.currentTh.style.minWidth = String(convertToUnit(width))
      }
    }

    const setNextTh = (width: number): void => {
      if (resize.nextTh) {
        resize.nextTh.style.width = String(convertToUnit(width))
        resize.nextTh.style.minWidth = String(convertToUnit(width))
      }
    }

    const moveResizePad = (e: MouseEvent | TouchEvent): void => {
      e.stopPropagation()

      if (resize.currentTh === null) {
        return
      }
      const currentWidth = resize.currentOffsetStart + getPageX(e)
      if (resize.nextTh) {
        const nextWidth = resize.nextOffsetStart - getPageX(e)
        if (currentWidth >= resizeMinWidth) {
          setNextTh(nextWidth)
          setCurrentTh(currentWidth)
        } else {
          if (currentWidth >= resizeMinWidth) {
            setCurrentTh(currentWidth)
          }
        }
      }
    }

    const stopResizePad = (e: MouseEvent | TouchEvent): void => {
      e.stopPropagation()

      document.removeEventListener('mousemove', moveResizePad)
      document.removeEventListener('touchmove', moveResizePad)
      document.removeEventListener('mouseup', stopResizePad)
      document.removeEventListener('touchend', stopResizePad)
    }

    const startResizePad = (e: MouseEvent | TouchEvent): void => {
      e.stopPropagation()

      resize.currentTh = (e.target as HTMLElement).parentElement
      if (resize.currentTh === null) {
        return
      }
      resize.currentOffsetStart = resize.currentTh.offsetWidth - getPageX(e)
      resize.nextTh = resize.currentTh.nextElementSibling as HTMLElement | null
      if (resize.nextTh) {
        resize.nextOffsetStart = resize.nextTh.offsetWidth + getPageX(e)
      }

      document.addEventListener('mousemove', moveResizePad)
      document.addEventListener('touchmove', moveResizePad)
      document.addEventListener('mouseup', stopResizePad)
      document.addEventListener('touchend', stopResizePad)
    }

    return () => (
      <thead role={'rowgroup'}>
        <tr class={['headers-row']} role={'row'}>
          {props.headers.map((header: RedDataTableHeader, index: number) => {
            return (
              <th
                aria-colindex={index + 1}
                aria-label={header.text}
                aria-sort={props.disableSorting ? undefined : col.value[header.value].ariaSort}
                class={[
                  `align-${header.align || 'left'}`,
                  header.headerClass,
                  col.value[header.value].class,
                  {
                    sortable: props.disableSorting === false && header.sortable
                  }
                ]}
                id={`rdt-col-${index + 1}`}
                role={'columnheader'}
                scope={'col'}
                style={{
                  width: convertToUnit(header.width),
                  minWidth: convertToUnit(header.width)
                }}
                tabindex={0}
              >
                {props.columnResizing && (index + 1) < props.headers.length
                  ? (<div
                    class={['column-resize-pad']}
                    onClick={(e: MouseEvent | TouchEvent) => {
                      e.stopPropagation()
                    }}
                    onMousedown={startResizePad}
                    onTouchstart={startResizePad}
                  ></div>)
                  : ''}
                {props.disableSorting === false && header.sortable
                  ? (<i
                    aria-hidden={'true'}
                    class={[
                      'header-sort-icon',
                      col.value[header.value].ariaSort === 'descending' ? props.iconSortDesc : props.iconSortAsc
                    ]}
                  ></i>)
                  : ''}
                <div
                  class={['header-name']}
                  title={header.text}
                  onClick={(e: MouseEvent | TouchEvent): void => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (props.disableSorting === false && header.sortable) {
                      Object.keys(col.value)
                        .filter((item: string) => item !== header.value)
                        .forEach((item: string) => {
                          col.value[item] = headerColAttributesInit()
                        })
                      switch (col.value[header.value].ariaSort) {
                        case 'none':
                          col.value[header.value].ariaSort = 'ascending'
                          col.value[header.value].class = 'column-sorted-asc'
                          break
                        case 'ascending':
                          col.value[header.value].ariaSort = 'descending'
                          col.value[header.value].class = 'column-sorted-desc'
                          break
                        case 'descending':
                          col.value[header.value].ariaSort = 'none'
                          col.value[header.value].class = ''
                          break
                      }
                      emit('sortColumn', {
                        sort: header.value,
                        direction: col.value[header.value].ariaSort
                      })
                    }
                  }}
                >
                  {slots[`header.${header.value}`]
                    ? (slots[`header.${header.value}`]?.({ value: header.text, header: header }))
                    : header.text}
                </div>
              </th>
            )
          })}
        </tr>
      </thead>
    )
  }
})
