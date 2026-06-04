<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-neutral-950">
    <div class="w-full max-w-xl bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800/60 relative overflow-hidden">
      
      <div class="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-orange-600 to-amber-500"></div>
      
      <header class="text-center mb-8">
        <h1 class="text-4xl font-black tracking-wider text-neutral-50 flex items-center justify-center gap-2">
          <span class="font-mono italic">HYPER</span><span class="text-orange-500 font-mono italic">SAVE</span>
        </h1>
        <p class="text-neutral-400 mt-2 text-sm max-w-sm mx-auto">
          Insira o link da mídia para realizar o download instantâneo em alta qualidade.
        </p>
      </header>

      <form @submit.prevent="handleDownload" class="space-y-6">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">URL da Mídia</label>
          <input 
            v-model="url"
            type="text" 
            placeholder="https://www.youtube.com/watch?v=..." 
            class="w-full px-4 py-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
            :disabled="loading"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Escolha o Formato</label>
          <div class="grid grid-cols-2 gap-4">
            <button 
              type="button"
              @click="format = 'mp4'"
              :class="[
                'py-4 rounded-xl font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-1 group',
                format === 'mp4' 
                  ? 'bg-orange-500/10 border-orange-500 text-orange-400' 
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
              ]"
            >
              <span class="text-xl transition-transform group-hover:scale-110 duration-200">🎬 Vídeo</span>
              <span class="text-xs font-normal opacity-70">Arquivo MP4</span>
            </button>

            <button 
              type="button"
              @click="format = 'mp3'"
              :class="[
                'py-4 rounded-xl font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-1 group',
                format === 'mp3' 
                  ? 'bg-orange-500/10 border-orange-500 text-orange-400' 
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
              ]"
            >
              <span class="text-xl transition-transform group-hover:scale-110 duration-200">🎵 Áudio</span>
              <span class="text-xs font-normal opacity-70">Arquivo MP3</span>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-4 bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black rounded-xl transition-all duration-200 transform active:scale-[0.99] disabled:opacity-40 disabled:transform-none flex items-center justify-center gap-2 text-lg uppercase tracking-wider shadow-lg shadow-orange-500/10"
        >
          <span v-if="loading" class="animate-spin inline-block w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full"></span>
          {{ loading ? 'Processando...' : 'Salvar Arquivo' }}
        </button>
      </form>

      <transition name="fade">
        <div v-if="loading" class="mt-4 p-3 bg-neutral-950 border border-neutral-800/80 rounded-xl flex items-center justify-center gap-2 text-xs text-orange-400/90 font-medium">
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Isso pode levar alguns segundos dependendo do tamanho do arquivo.
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const url = ref('');
const format = ref('mp4');
const loading = ref(false);

const handleDownload = () => {
  if (!url.value) return;
  
  loading.value = true;
  const backendUrl = `http://localhost:3000/download?url=${encodeURIComponent(url.value)}&format=${format.value}`;
  
  try {
    const link = document.createElement('a');
    link.href = backendUrl;
    link.setAttribute('download', ''); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      loading.value = false;
      url.value = ''; 
    }, 4000);

  } catch (error) {
    loading.value = false;
    alert('Erro ao conectar com o servidor do HYPERSAVE.');
    console.error(error);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>