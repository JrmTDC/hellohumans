<template>
  <div class="ml-[-20px] mr-[-20px] pt-[12px] mt-[20px] ">
    <!-- Section Principale -->
    <section class="mr-[20px] ml-[20px]">
      <h3 class="flex items-center mt-0 mb-0 pt-0 pb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] font-medium">
        Principal
      </h3>
      <div class="pt-[20px] pb-[20px]">
        <!-- Bannière d'avertissement -->
        <div class="relative px-[20px] py-[13px] pr-[20px] pl-[44px] mb-[20px] rounded-[8px] bg-[#ffdda7] text-[#3a2300] text-[14px]">
          <div class="absolute top-[10px] left-[12px] flex items-center justify-center w-[24px] h-[24px]">
            <SvgoPanelHubIconWarling class="w-[24px] h-[24px] min-w-[24px] min-h-[24px] fill-[#d48200]" />
          </div>
          Pour activer ou tester {{ config.public.chatBotName }}, vous devez d'abord lui fournir des connaissances.
          <NuxtLink to="/panel/hub/data-sources/added" class="text-current underline font-medium hover:text-[#a16300]">
            Accéder à Sources de données pour ajouter
          </NuxtLink>
        </div>

        <!-- Toggle d'activation -->
        <div class="flex flex-col justify-start items-[normal] max-w-[750px] pt-0 mt-[20px]">
          <div class="flex flex-row justify-start items-start">
            <label for="" class="flex-[1_0_145px] min-w-[145px] max-w-[min(180px,12vw)] inline-block font-normal text-[14px] leading-[18px] tracking-[-0.01em]">
              Activer
            </label>
            <div class="flex-[1_1_0%] flex flex-row justify-start items-center">
              <div class="relative flex flex-row items-center ml-[24px]">
                <PanelCommonToggleSwitch v-model="activeAgentLoopi" :disabled="true"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Langues -->
    <section class="border-t border-t-[#e2e8ef] mt-[12px] mr-[20px] ml-[20px]">
      <div class="pt-[32px]">
        <h3 class="flex items-center mt-0 mb-0 pb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] font-medium">
          Langues
        </h3>
        <p class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">
          {{ config.public.chatBotName }} répond automatiquement dans la langue du widget de chat du visiteur.
          Vous pouvez définir ou ajouter d'autres langues dans les
          <NuxtLink to="/panel/settings" class="text-[#0566ff] no-underline hover:text-[#0047b7]">
            paramètres multilingues du widget
          </NuxtLink>
        </p>
      </div>
      <div class="pt-[20px] pb-[20px]">
        <div class="flex flex-col justify-start items-[normal] max-w-[750px] pt-0">
          <div class="flex flex-col justify-start items-[normal]">
            <div class="flex flex-row justify-start items-center [&>*:only-child]:w-full">
              <SvgoPanelHubIconFlag class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[rgb(100,116,145)]"/>
              <p class="mt-0 mb-0 ml-[12px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] [&:nth-child(2)]:mr-auto">
                FR - Français (par défaut)
              </p>
            </div>
          </div>
          <p class="mt-[20px] font-[400] text-[14px] leading-[18px] tracking-[-0.01em]">
            Les langues prises en charge pour {{ config.public.chatBotName }} sont les suivantes :
            anglais, espagnol, allemand, portugais, français et italien.
            <NuxtLink to="/panel/" class="font-normal text-[14px] text-[#0566ff] no-underline hover:text-[#0047b7]">
              En savoir plus
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const activeAgentLoopi = ref(false)
</script>
