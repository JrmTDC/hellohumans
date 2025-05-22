const allAssets = {
     ...import.meta.glob('~/assets/**/*.svg', { as: 'raw', eager: true }),
     ...import.meta.glob('~/assets/**/*.{gif,png,jpg,jpeg}', { as: 'arrayBuffer', eager: true }),
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
     const binary = String.fromCharCode(...new Uint8Array(buffer))
     return btoa(binary)
}

function svgTextToBase64(svg: string): string {
     const utf8 = new TextEncoder().encode(svg)
     const base64 = btoa(String.fromCharCode(...utf8))
     return `data:image/svg+xml;base64,${base64}`
}
export function useAssetBase64Loader(name: string): string | null {
     const entry = Object.entries(allAssets).find(([path]) =>
          path.includes(`/${name}.`)
     )
     if (!entry) return null

     const [path, content] = entry

     if (path.endsWith('.svg')) {
          return svgTextToBase64(content as string)
     } else if (/\.(gif|png|jpe?g)$/.test(path)) {
          const ext = path.split('.').pop()
          const base64 = arrayBufferToBase64(content as ArrayBuffer)
          return `data:image/${ext};base64,${base64}`
     }

     return null
}
