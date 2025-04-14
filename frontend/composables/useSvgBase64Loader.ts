const svgs = import.meta.glob('~/assets/svg/**/*.svg', { as: 'raw', eager: true })

export function useSvgBase64Loader(name: string): string | null {
     const entry = Object.entries(svgs).find(([path]) => path.includes(`/${name}.svg`))
     if (!entry) return null

     const rawSvg = entry[1] as string
     return svgTextToBase64(rawSvg)
}
