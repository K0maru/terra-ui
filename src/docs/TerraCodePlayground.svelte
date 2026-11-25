<script lang="ts">
  import type { Snippet } from 'svelte'
  import { Check, Copy } from 'lucide-svelte'

  interface Props {
    title?: string
    description?: string
    code: string
    activeView?: 'preview' | 'code' | 'split'
    class?: string
    children?: Snippet
  }

  let {
    title = '',
    description = '',
    code = '',
    activeView = 'split',
    class: className = '',
    children
  }: Props = $props()

  let currentTab = $derived<'preview' | 'code' | 'split'>(activeView)
  let copied = $state(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      copied = true
      setTimeout(() => {
        copied = false
      }, 1500)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      copied = true
      setTimeout(() => {
        copied = false
      }, 1500)
    }
  }
</script>

<div
  class="isolate border border-[var(--terra-border)] bg-[var(--terra-bg-surface)] overflow-hidden {className}"
>
  <div
    class="flex items-center justify-between px-3 py-2 border-b border-[var(--terra-border)] bg-[var(--terra-bg-surface-hover)]"
  >
    <div class="flex items-center gap-2 min-w-0">
      <span class="w-1.5 h-1.5 bg-[var(--terra-accent-primary)] shrink-0"></span>
      <span
        class="font-mono text-[11px] font-bold tracking-wider text-[var(--terra-text-primary)] truncate"
      >
        {title || 'INTERACTIVE PLAYGROUND'}
      </span>
      {#if description}
        <span
          class="hidden sm:inline font-mono text-[10px] text-[var(--terra-text-muted)] truncate"
        >
          // {description}
        </span>
      {/if}
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <div
        class="inline-flex border border-[var(--terra-border)] bg-[var(--terra-bg-base)] text-[10px] font-mono"
      >
        <button
          type="button"
          onclick={() => (currentTab = 'split')}
          class="terra-t-color px-2 py-0.5 cursor-pointer {currentTab === 'split'
            ? 'bg-[var(--terra-accent-primary)] text-[var(--terra-on-accent)] font-bold'
            : 'text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}"
        >
          SPLIT
        </button>
        <button
          type="button"
          onclick={() => (currentTab = 'preview')}
          class="terra-t-color px-2 py-0.5 border-l border-[var(--terra-border)] cursor-pointer {currentTab ===
          'preview'
            ? 'bg-[var(--terra-accent-primary)] text-[var(--terra-on-accent)] font-bold'
            : 'text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}"
        >
          PREVIEW
        </button>
        <button
          type="button"
          onclick={() => (currentTab = 'code')}
          class="terra-t-color px-2 py-0.5 border-l border-[var(--terra-border)] cursor-pointer {currentTab ===
          'code'
            ? 'bg-[var(--terra-accent-primary)] text-[var(--terra-on-accent)] font-bold'
            : 'text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}"
        >
          CODE
        </button>
      </div>

      <button
        type="button"
        onclick={handleCopy}
        class="terra-pressable flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 border border-[var(--terra-border)] hover:border-[var(--terra-accent-primary)] bg-[var(--terra-bg-base)] text-[var(--terra-text-primary)] hover:text-[var(--terra-accent-primary)] cursor-pointer select-none"
      >
        {#if copied}
          <Check class="w-3 h-3 text-[var(--terra-accent-success)]" />
          <span class="text-[var(--terra-accent-success)] font-bold">COPIED</span>
        {:else}
          <Copy class="w-3 h-3" />
          <span>COPY</span>
        {/if}
      </button>
    </div>
  </div>

  <div
    class={currentTab === 'split'
      ? 'grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--terra-border)]'
      : ''}
  >
    {#if currentTab === 'preview' || currentTab === 'split'}
      <div
        class="relative p-6 flex items-center justify-center min-h-[180px] bg-[radial-gradient(circle_at_center,rgba(var(--terra-dot-rgb),0.06)_1px,transparent_1px)] bg-[size:16px_16px] overflow-hidden"
      >
        <div
          class="absolute top-2 left-2 text-[10px] font-mono text-[var(--terra-text-muted)] select-none opacity-40"
        >
          +
        </div>
        <div
          class="absolute top-2 right-2 text-[10px] font-mono text-[var(--terra-text-muted)] select-none opacity-40"
        >
          +
        </div>
        <div
          class="absolute bottom-2 left-2 text-[10px] font-mono text-[var(--terra-text-muted)] select-none opacity-40"
        >
          +
        </div>
        <div
          class="absolute bottom-2 right-2 text-[10px] font-mono text-[var(--terra-text-muted)] select-none opacity-40"
        >
          +
        </div>

        <div class="w-full max-w-full flex justify-center items-center">
          {@render children?.()}
        </div>
      </div>
    {/if}

    {#if currentTab === 'code' || currentTab === 'split'}
      <div
        class="relative bg-[var(--terra-bg-base)] p-4 overflow-x-auto text-[11px] font-mono leading-relaxed select-text"
      >
        <div
          class="text-[10px] uppercase tracking-wider text-[var(--terra-text-muted)] border-b border-[var(--terra-border)]/40 pb-1 mb-2 flex items-center justify-between select-none"
        >
          <span>// Svelte 5 Native Rune Implementation</span>
          <span class="text-[var(--terra-accent-primary)] font-bold">.svelte</span>
        </div>
        <pre class="text-[var(--terra-text-primary)] font-mono whitespace-pre overflow-x-auto"><code
            >{code.trim()}</code
          ></pre>
      </div>
    {/if}
  </div>
</div>
