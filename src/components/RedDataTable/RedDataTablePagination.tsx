import { defineComponent, reactive, watch } from 'vue'
import type { PropType } from 'vue'

// Utilities
import { calcPageCount } from './utils/helpers'

export default defineComponent({
  name: 'RedDataTablePagination',

  props: {
    iconPagePrev: {
      type: String,
      default: 'rdt-font nav-page-prev'
    },
    iconPageNext: {
      type: String,
      default: 'rdt-font nav-page-next'
    },
    itemsCount: {
      type: Number,
      required: true,
      default: 0
    },
    itemsPerPage: {
      type: Number,
      required: true,
      default: 10
    },
    itemsPerPageOptions: {
      type: Array as PropType<number[]>,
      default: () => [10, 20, 30, 100, 150, -1]
    },
    page: {
      type: Number,
      required: true,
      default: 1
    }
  },

  emits: ['update', 'pageCount'],

  setup (props, { emit }) {
    const data = reactive({
      pageCount: calcPageCount(props.itemsCount, props.itemsPerPage),
      page: Number(props.page),
      itemsPerPage: Number(props.itemsPerPage)
    })
    let itemsPerPageOptions: number[] = [data.itemsPerPage, ...props.itemsPerPageOptions]

    const setRowsPerPage = (): Record<string, string | number>[] => {
      const result: Record<string, string | number>[] = []
      itemsPerPageOptions.filter((v, i, arr) => arr.indexOf(v) === i && v > -1)
        .sort((nr1: number, nr2: number) => nr1 - nr2)
        .forEach((nr: number) => {
          result.push({ value: nr, text: `${nr} rows` })
        })
      // Add All(-1) item if is available as option always at the end
      if (props.itemsPerPageOptions.includes(-1)) {
        result.push({ value: -1, text: 'All' })
      }
      return result
    }

    const drawPagintion = (
      currentPageNumber: number,
      totalPageNumber: number,
      offset = 2
    ): (string | number)[] => {
      /*
       * By doing this, when we are close to the beginning or end of the pagination,
       * two numbers are generated after/before the current page, but when we are far from these points
       * (in the middle of the pagination), we generate only one number after/before the current page
       */
      const offsetNumber = currentPageNumber <= offset || currentPageNumber > totalPageNumber - offset
        ? offset
        : offset - 1
      const numbersList = []
      const numbersListWithDots: (number | string)[] = []

      /*
       * If itemsPerPage is less than what the user selected with the Select component
       * or if there is no page or only one page
       */
      if (totalPageNumber <= 1 || totalPageNumber === undefined) {
        return [1]
      }

      // Create list of numbers
      numbersList.push(1)
      for (let i = currentPageNumber - offsetNumber; i <= currentPageNumber + offsetNumber; i++) {
        if (i < totalPageNumber && i > 1) {
          numbersList.push(i)
        }
      }
      numbersList.push(totalPageNumber)

      // Add three dots to the list of numbers
      numbersList.reduce((accumulator, currentValue) => {
        if (accumulator === 1) {
          numbersListWithDots.push(accumulator)
        }
        if (currentValue - accumulator !== 1) {
          numbersListWithDots.push('...')
        }
        numbersListWithDots.push(currentValue)
        return currentValue
      })
      return numbersListWithDots
    }

    // Recalculate
    watch(() => props.itemsCount, (nr: number) => {
      data.page = 1
      data.pageCount = calcPageCount(Number(nr), data.itemsPerPage)
    }, {
      immediate: true
    })
    watch(() => props.itemsPerPage, (nr: number) => {
      data.itemsPerPage = Number(nr)
      data.page = 1
      data.pageCount = calcPageCount(props.itemsCount, data.itemsPerPage)
      if (!props.itemsPerPageOptions.includes(data.itemsPerPage)) {
        itemsPerPageOptions = [data.itemsPerPage, ...props.itemsPerPageOptions]
      }
    })

    // Render Pagination
    let pageArray = drawPagintion(data.page, data.pageCount)
    watch(data, (value) => {
      pageArray = drawPagintion(value.page, value.pageCount)
      emit('update', value)
      emit('pageCount', value.pageCount)
    })

    return () => {
      return (
        <nav
          class={['red-data-table__pagination']}
          role={'navigation'}
        >
          <div class={['red-data-table__pagination--rows-selector']}>
            <label>Rows per page:</label>
            <select
              role={'combobox'}
              tabindex={0}
              value={data.itemsPerPage}
              onChange={(e: Event) => {
                data.page = 1
                data.itemsPerPage = Number((e.target as HTMLSelectElement).value)
                data.pageCount = calcPageCount(props.itemsCount, data.itemsPerPage)
              }}
            >
              {setRowsPerPage().map((item) => (<option value={item.value}>{item.text}</option>))}
            </select>
          </div>
          <button
            aria-label={'Prev page'}
            class={['red-data-table__pagination--navigation', 'red-data-table__pagination--navigation-page-prev']}
            disabled={data.page === 1}
            role={'button'}
            tabindex={-1}
            type={'button'}
            onClick={(e: MouseEvent | TouchEvent) => {
              e.preventDefault()
              if (data.page > 1) {
                data.page -= 1
              } else {
                data.page = 1
              }
            }}
          >
            <i aria-hidden={'true'} class={props.iconPagePrev}></i>
          </button>
          {pageArray.map((page: string | number) => {
            return (
              page === '...'
                ? (<span class={['red-data-table__pagination--navigation']}>...</span>)
                : (<button
                  aria-label={`Page ${page}`}
                  class={[
                    'red-data-table__pagination--navigation',
                    {
                      'red-data-table__pagination--navigation-active': data.page === Number(page)
                    }
                  ]}
                  role={'button'}
                  tabindex={0}
                  type={'button'}
                  onClick={(e: MouseEvent | TouchEvent) => {
                    e.preventDefault()
                    page = Number(page)
                    if (data.page !== page) {
                      data.page = page
                    }
                  }}
                >{page}</button>)
            )
          })}
          <button
            aria-label={'Next page'}
            class={['red-data-table__pagination--navigation', 'red-data-table__pagination--navigation-page-next']}
            disabled={data.page === data.pageCount}
            role={'button'}
            tabindex={-1}
            type={'button'}
            onClick={(e: MouseEvent | TouchEvent) => {
              e.preventDefault()
              if (data.page < data.pageCount) {
                data.page += 1
              } else {
                data.page = data.pageCount
              }
            }}
          >
            <i aria-hidden={'true'} class={props.iconPageNext}></i>
          </button>
        </nav>
      )
    }
  }
})
