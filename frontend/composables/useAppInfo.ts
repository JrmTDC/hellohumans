import { useRuntimeConfig } from "#imports";

export const useAppInfo = () => {
     const config = useRuntimeConfig()
     return {
          appName: config.public.appName,
          appYear: config.public.appYear,
     }
}
