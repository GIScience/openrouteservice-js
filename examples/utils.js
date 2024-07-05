export function prettifyJson(json) {
  let response = JSON.stringify(json, null, '\t')
  response = response.replace(/(\n)/g, '<br>')
  return response.replace(/(\t)/g, '&nbsp;&nbsp;')
}
