<template>
  <div class="min-h-screen bg-[#09090b] text-neutral-100 selection:bg-orange-500 selection:text-neutral-950 relative overflow-hidden">
    <div class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none"></div>

    <main class="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-10 sm:px-8">
      <nav class="mb-12 flex items-center justify-between">
        <a href="#" class="flex items-center gap-2.5" aria-label="HyperSave início">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-lg font-black text-neutral-950 shadow-lg shadow-orange-500/20">H</span>
          <span class="text-lg font-black tracking-tight">HYPER<span class="text-orange-500">SAVE</span></span>
        </a>
        <div class="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium text-emerald-300">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400"></span>
          Serviço online
        </div>
      </nav>

      <div class="grid items-center gap-12 lg:grid-cols-[1fr_480px]">
        <header class="text-center lg:text-left">
          <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/5 px-3 py-1.5 text-xs font-semibold text-orange-300">
            <span>✦</span> Download simples, rápido e gratuito
          </div>
          <h1 class="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
            Seus vídeos favoritos,
            <span class="bg-linear-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent"> do seu jeito.</span>
          </h1>
          <p class="mt-5 max-w-lg text-base leading-relaxed text-neutral-400 sm:text-lg">
            Baixe vídeos e áudios em poucos segundos. Cole o link, escolha o formato e pronto.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-neutral-400 lg:justify-start">
            <span class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Sem cadastro</span>
            <span class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Alta qualidade</span>
            <span class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Seguro</span>
          </div>
        </header>

        <section class="w-full rounded-3xl border border-white/10 bg-white/[0.045] p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div class="rounded-[1.35rem] bg-[#111113] p-6 sm:p-8">
            <div class="mb-7 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 class="font-bold text-white">Comece seu download</h2>
                <p class="text-xs text-neutral-500">Cole o link da mídia abaixo</p>
              </div>
            </div>

      <transition name="fade">
        <div v-if="errorMessage" class="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          <span class="mt-0.5 text-xl">⚠️</span>
          <div class="flex-1">
            <p class="font-bold text-red-300">Não foi possível baixar</p>
            <p class="mt-0.5 text-xs opacity-90">{{ errorMessage }}</p>
          </div>
          <button type="button" @click="errorMessage = ''" class="rounded bg-red-500/5 px-2 py-1 text-xs font-bold text-red-400 transition hover:bg-red-500/20 hover:text-red-300">
            Fechar
          </button>
        </div>
      </transition>

      <form @submit.prevent="handleDownload" class="space-y-5">
        <div>
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400" for="media-url">URL da mídia</label>
          <div class="relative">
            <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input id="media-url"
            v-model="url"
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            :class="[
              'w-full rounded-xl border bg-neutral-950 py-3.5 pl-11 pr-4 text-sm text-neutral-100 outline-none transition-all duration-200 placeholder:text-neutral-600 focus:ring-2',
              errorMessage 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
                : 'border-white/10 focus:border-orange-500 focus:ring-orange-500/20'
            ]"
            :disabled="loading"
            required
            />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400">Escolha o formato</label>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" @click="format = 'mp4'"
              :class="[
                'flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 group',
                format === 'mp4' 
                  ? 'border-orange-500/60 bg-orange-500/10 text-orange-300'
                  : 'border-white/10 bg-neutral-950 text-neutral-500 hover:border-white/20 hover:text-neutral-300'
              ]"
            >
              <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-lg transition-transform group-hover:scale-110">▶</span>
              <span><strong class="block text-sm">Vídeo</strong><small class="text-[11px] opacity-60">MP4</small></span>
            </button>

            <button type="button" @click="format = 'mp3'"
              :class="[
                'flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 group',
                format === 'mp3' 
                  ? 'border-orange-500/60 bg-orange-500/10 text-orange-300'
                  : 'border-white/10 bg-neutral-950 text-neutral-500 hover:border-white/20 hover:text-neutral-300'
              ]"
            >
              <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-lg transition-transform group-hover:scale-110">♫</span>
              <span><strong class="block text-sm">Áudio</strong><small class="text-[11px] opacity-60">MP3</small></span>
            </button>
          </div>
        </div>

        <button type="submit"
          :disabled="loading"
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-black uppercase tracking-wider text-neutral-950 shadow-lg shadow-orange-500/10 transition-all duration-200 hover:bg-orange-400 active:scale-[0.99] disabled:transform-none disabled:opacity-40"
        >
          <span v-if="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent"></span>
          <span>{{ loading ? 'Processando...' : 'Baixar agora' }}</span>
        </button>
      </form>

      <transition name="fade">
        <div v-if="loading" class="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-neutral-950 p-3 text-xs font-medium text-orange-400/90">
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Isso pode levar alguns segundos dependendo do tamanho do arquivo.
        </div>
      </transition>
          </div>
        </section>
      </div>

      <footer class="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-neutral-600 sm:flex-row">
        <span>© 2025 HyperSave. Feito para facilitar seus downloads.</span>
        <span class="flex items-center gap-1.5"><span class="text-emerald-400">●</span> Seus links são processados com segurança</span>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const url = ref('');
const format = ref('mp4');
const loading = ref(false);
const errorMessage = ref(''); 

const handleDownload = async () => {
  if (!url.value) return;
  
  loading.value = true;
  errorMessage.value = ''; 

  const apiBaseUrl = 'https://hypersaveapi-production.up.railway.app';

  try {
    
    const validateResponse = await fetch(`${apiBaseUrl}/validate?url=${encodeURIComponent(url.value)}`);
    const validation = await validateResponse.json();

    if (!validation.valid) {
      errorMessage.value = validation.error || 'A URL informada não é aceita pelo sistema.';
      loading.value = false;
      return;
    }

    const backendUrl = `${apiBaseUrl}/download?url=${encodeURIComponent(url.value)}&format=${format.value}`;

    const downloadResponse = await fetch(backendUrl);

    if (!downloadResponse.ok) {
      const errData = await downloadResponse.json().catch(() => ({}));
      errorMessage.value = errData.error || 'Erro ao processar o download. Tente novamente.';
      loading.value = false;
      return;
    }

    const blob = await downloadResponse.blob();
    const objectUrl = URL.createObjectURL(blob);

    
    const disposition = downloadResponse.headers.get('Content-Disposition');
    let fileName = `hypersave.${format.value}`; 
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match) fileName = match[1];
    }

    const link = document.createElement('a');
    link.href = objectUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);

    loading.value = false;
    url.value = '';

  } catch (error) {
    loading.value = false;
    errorMessage.value = 'Não foi possível estabelecer conexão com o servidor do HYPERSAVE. Por favor, verifique sua conexão e tente novamente.';
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