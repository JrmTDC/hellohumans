import type { Component } from 'vue'
import { markRaw } from 'vue'

export const rawIcon = (icon: unknown) => markRaw(icon as Component)
