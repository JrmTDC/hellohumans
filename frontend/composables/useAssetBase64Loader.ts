const allAssets = {
     ...import.meta.glob('~/assets/**/*.svg', { query: '?raw', import: 'default', eager: true }),
     ...import.meta.glob('~/assets/**/*.{gif,png,jpg,jpeg}', { query: '?arrayBuffer', import: 'default', eager: true }),
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

function isPromise<T = any>(obj: unknown): obj is Promise<T> {
     return typeof obj === 'object' && obj !== null && 'then' in obj
}

export async function useAssetBase64Loader(name: string): Promise<string | null> {
     const entry = Object.entries(allAssets).find(([path]) =>
          path.includes(`/${name}.`)
     )
     if (!entry) return null

     const [path, contentRaw] = entry
     const content = isPromise(contentRaw) ? await contentRaw : contentRaw

     if (path.endsWith('.svg')) {
          return svgTextToBase64(content as string)
     } else if (/\.(gif|png|jpe?g)$/.test(path)) {
          const ext = path.split('.').pop()
          const base64 = arrayBufferToBase64(content as ArrayBuffer)
          return `data:image/${ext};base64,${base64}`
     }

     return null
}
