/* eslint-disable @typescript-eslint/no-explicit-any */

export function convertToUnit (str: string | number | null | undefined, unit = 'px'): string | undefined {
  if (str == null || str === '') {
    return undefined
  } else if (isNaN(+str)) {
    return String(str)
  } else if (!isFinite(+str)) {
    return undefined
  } else {
    return `${Number(str)}${unit}`
  }
}

export function getNestedValue (obj: any, path: (string | number)[], fallback?: any): any {
  const last = path.length - 1
  if (last < 0) {
    return obj === undefined ? fallback : obj
  }
  for (let i = 0; i < last; i++) {
    if (obj == null) {
      return fallback
    }
    obj = obj[path[i]]
  }
  if (obj == null) {
    return fallback
  }
  return obj[path[last]] === undefined ? fallback : obj[path[last]]
}

export function getObjectValueByPath (obj: any, path: string, fallback?: any): any {
  if (obj == null || !path || typeof path !== 'string') {
    return fallback
  }
  if (obj[path] !== undefined) {
    return obj[path]
  }
  path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  path = path.replace(/^\./, '') // strip a leading dot
  return getNestedValue(obj, path.split('.'), fallback)
}

export function getType (obj: any): string {
  const result = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)
  return result ? result[1].toLowerCase() : ''
}

/* export function objectIsEqual (obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
  const isObject = (obj: Record<string, unknown>): boolean => obj !== null && typeof obj === 'object'
  const props1 = Object.getOwnPropertyNames(obj1)
  const props2 = Object.getOwnPropertyNames(obj2)
  if (props1.length !== props2.length) {
    return false
  }
  for (let i = 0; i < props1.length; i++) {
    const val1 = obj1[props1[i]] as Record<string, unknown>
    const val2 = obj2[props1[i]] as Record<string, unknown>
    const isObjects = isObject(val1) && isObject(val2)
    if ((isObjects && !objectIsEqual(val1, val2)) || (!isObjects && val1 !== val2)) {
      return false
    }
  }
  return true
} */

export function calcPageCount (itemsCount: number, itemsPerPage: number): number {
  let pageCount = 1
  if (itemsPerPage > 0) {
    pageCount = Math.ceil(itemsCount / itemsPerPage)
    if (pageCount <= 0) {
      pageCount = 1
    }
  }
  return pageCount
}
