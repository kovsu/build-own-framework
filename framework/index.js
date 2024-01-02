import { eventListenersModule, init as initSnabbdom } from 'snabbdom'

export const patch = initSnabbdom([
  eventListenersModule, // 添加事件监听
])

export function init(selector, component) {
  const app = document.querySelector(selector)
  patch(app, component.template)
}

let state = {}

export function createComponent({
  template,
  methods = {},
  initialState = {},
}) {
  state = initialState
  let previous

  const mappedMethods = props =>
    Object.keys(methods).reduce(
      (acc, key) => ({
        ...acc,
        [key]: (...args) => {
          state = methods[key](state, ...args)
          const nextNode = template({
            ...props,
            ...state,
            methods: mappedMethods(props),
          })
          patch(previous.template, nextNode.template)
          previous = nextNode
          return state
        },
      }),
      {},
    )

  return (props) => {
    previous = template({ ...props, ...state, methods: mappedMethods(props) })
    return previous
  }
}
