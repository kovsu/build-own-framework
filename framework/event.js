export function onClick(f) {
  return {
    type: 'event',
    click: f,
  }
}
