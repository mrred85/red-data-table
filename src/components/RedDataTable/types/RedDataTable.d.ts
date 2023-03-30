declare module 'types/red-data-table' {
  export interface RedDataTableHeader {
    align?: 'left' | 'center' | 'right'
    headerClass?: string;
    hidden?: boolean
    itemClass?: string;
    multiline?: boolean
    sortable?: boolean
    text: string
    value: string
    width?: string | number
  }

  export interface RedDataTableSortColumnData {
    sort: string
    direction: string
  }
}
