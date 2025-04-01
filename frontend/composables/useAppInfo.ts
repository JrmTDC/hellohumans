import { useRuntimeConfig } from "#imports";
console.log(import.meta.env)

export const useAppInfo = () => {
     const config = useRuntimeConfig()
     return {
          appName: config.public.appName,
          appYear: config.public.appYear,
     }
}
