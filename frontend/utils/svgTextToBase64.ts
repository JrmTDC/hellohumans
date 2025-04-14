export function svgTextToBase64(svg: string): string {
     return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}
