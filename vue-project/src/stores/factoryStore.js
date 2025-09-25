import { ref } from 'vue'

const factory = ref('')

export function useFactoryStore() {
  function setFactory(name) {
    factory.value = name
  }
  return { factory, setFactory }
}