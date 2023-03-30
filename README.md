# Red DataTable

This project is a custom DataTable project component for Vuejs 3 written in TypeScript.

## Installation

Copy the folder `RedDataTable` from `/src/components` tou your project and include in yout vue file:

```typescript
// Component
import RedDataTable from '@/components/RedDataTable'

// Additional types
import { RedDataTableHeader } from 'types/red-data-table'
```

If you are using **Options API** you need to load RedDataTable in components property:

```typescript
export default defineComponent({
  components: {
    RedDataTable
  }
})
```

### Dependencies

To run the project you need to install dependencies. I used `npm` and the `package-lock.json` file is also provided. In console type `npm install` to get all packages.

## Features
- Minimal styles provided (w/ scss)
- Pagination
- Headers and column chooser
- Columns resize
- Row selection
- Search

### Options
- Borders and alternate rows style
- Column sorting
- Header and item customization (via slots)
- Items per page customization
- Single and multiple selction

## Example

You can view full implementation in `/src/views/HomeView.vue` file. Because is a vue project you can also run it with `npm run serve` command.

The example below is witten using **Composition API** and is a basic implementation:
```vue
<template>
  <RedDataTable
    :headers="headers"
    :items="items"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RedDataTableHeader } from 'types/red-data-table'
import RedDataTable from '@/components/RedDataTable'

const headers = ref<RedDataTableHeader[]>([])
const items = ref<any>([])

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
  }
]
items.value = [
  {
    name: 'Frozen Yogurt',
    calories: 159
  },
  {
    name: 'Ice cream sandwich',
    calories: 237
  },
  {
    name: 'Eclair',
    calories: 262
  }
]
</script>
```


Enjoy ;)
