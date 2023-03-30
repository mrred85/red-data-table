import { defineComponent, reactive } from 'vue'
import type { PropType } from 'vue'
import { RedDataTableHeader } from 'types/red-data-table'

export default defineComponent({
  name: 'RedDataTableColumnChooser',

  props: {
    iconCheckBoxOff: {
      type: String,
      default: 'rdt-font checkbox-off'
    },
    iconCheckBoxOn: {
      type: String,
      default: 'rdt-font checkbox-on'
    },
    iconColumnChooser: {
      type: String,
      default: 'rdt-font column-chooser'
    },
    headers: {
      type: Array as PropType<RedDataTableHeader[]>,
      required: true,
      default: () => []
    },
    headersSelector: {
      type: Array as PropType<string[]>,
      required: true,
      default: () => []
    }
  },

  emits: ['selectedHeaders'],

  setup (props, { emit }) {
    const data = reactive({
      menu: false,
      selectedHeaders: props.headersSelector
    })

    return () => (
      <div
        class={['red-data-table__column-chooser']}
        role={'menubar'}
      >
        <button
          aria-haspopup={'true'}
          aria-label={'Column Chooser'}
          class={[data.menu ? 'red-data-table__column-chooser--menuitem-active' : undefined]}
          role={'menuitem'}
          tabindex={-1}
          type={'button'}
          onClick={(e: MouseEvent | TouchEvent) => {
            e.preventDefault()
            e.stopPropagation()
            data.menu = !data.menu
          }}
        >
          <i aria-hidden={'true'} class={props.iconColumnChooser}></i>
        </button>
        <div
          class={['red-data-table__column-chooser--content']}
          role={'menu'}
          style={`display:${data.menu ? 'block' : 'none'}`}
        >
          <ul role={'none'}>
            {props.headers.map((header: RedDataTableHeader) => (<li role={'none'}>
              <div
                class={[
                  'red-data-table__column-chooser--menuitem',
                  data.selectedHeaders.includes(header.value) ? 'red-data-table__column-chooser--menuitem-active' : undefined
                ]}
                role={'menuitem'}
                tabindex={-1}
                onClick={(e: MouseEvent | TouchEvent) => {
                  e.preventDefault()
                  let headers = [...data.selectedHeaders]
                  if (headers.includes(header.value)) {
                    headers = headers.filter(item => item !== header.value)
                  } else {
                    headers.push(header.value)
                  }
                  data.selectedHeaders = headers
                  emit('selectedHeaders', headers)
                }}
              >
                <div class={['red-data-table__column-chooser--icon']}>
                  <i
                    aria-hidden={'true'}
                    class={props.headersSelector.includes(header.value) ? props.iconCheckBoxOn : props.iconCheckBoxOff}
                  ></i>
                </div>
                <span>{header.text}</span>
              </div>
            </li>))}
          </ul>
        </div>
      </div>
    )
  }
})
