// dom lookups, cached for just a tick

import {BBox} from 'universal/components/RetroReflectPhase/FLIPModal'

const cache = new Map()
let timer

const getBBox = (el: HTMLElement): BBox => {
  if (!cache.has(el)) {
    const {height, width, top, left} = el.getBoundingClientRect()
    cache.set(el, {height, width, top, left})
    if (!timer) {
      timer = setTimeout(() => {
        timer = undefined
        cache.clear()
      })
    }
  }
  return cache.get(el)
}

export default getBBox
