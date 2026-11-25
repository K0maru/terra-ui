<script lang="ts">
  import TerraBadge from './TerraBadge.svelte'
  import TerraStatusBeacon from './TerraStatusBeacon.svelte'
  import TerraBarcode from './TerraBarcode.svelte'
  import TerraButton from './TerraButton.svelte'
  import { i18n } from '../i18n'

  interface Props {
    avatarUrl?: string
    username?: string
    nickname?: string
    role?: string
    roleZh?: string
    status?: 'online' | 'standby' | 'alert' | 'offline'
    statusLabel?: string
    statusLabelZh?: string
    uid?: string
    reposCount?: number
    githubUrl?: string
    repoUrl?: string
    class?: string
    locale?: 'en' | 'zh'
  }

  let {
    avatarUrl = 'https://avatars.githubusercontent.com/u/93422639?v=4',
    username = 'K0maru',
    nickname = '',
    role = 'Lead Maintainer & Architect',
    roleZh = '核心主创 & 架构师',
    status = 'online',
    statusLabel = 'ACTIVE',
    statusLabelZh = '在线维护',
    uid = 'UID-93422639',
    reposCount = 9,
    githubUrl = 'https://github.com/K0maru',
    repoUrl = 'https://github.com/K0maru/terra-ui',
    class: className = '',
    locale
  }: Props = $props()

  const currentLocale = $derived(locale || i18n.locale)
  const isZh = $derived(currentLocale === 'zh')

  const displayRole = $derived(isZh ? roleZh : role)
  const displayStatusLabel = $derived(isZh ? statusLabelZh : statusLabel)
  const displayStats = $derived(
    isZh
      ? `${reposCount} 个开源仓库 // 持续交付`
      : `${reposCount} Public Repositories // Open Source`
  )

  function openGithub() {
    window.open(githubUrl, '_blank', 'noopener,noreferrer')
  }

  function openRepo() {
    window.open(repoUrl, '_blank', 'noopener,noreferrer')
  }
</script>

<div
  class="isolate terra-t-color relative p-5 sm:p-6 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] flex flex-col justify-between overflow-hidden select-none {className}"
>
  <div
    class="absolute -right-6 -bottom-8 pointer-events-none opacity-[0.04] font-display text-8xl font-black text-[var(--terra-text-primary)] uppercase select-none"
  >
    {username}
  </div>

  <div class="flex items-center justify-between gap-2 pb-3 border-b border-[var(--terra-border)]">
    <div class="flex items-center gap-2">
      <TerraBadge label="MAINTAINER" code="CORE" variant="primary" />
      <TerraBadge label={isZh ? '开源贡献' : 'OPEN SOURCE'} code="OSS" variant="outline" />
    </div>

    <div class="flex items-center gap-3">
      <TerraStatusBeacon {status} label={displayStatusLabel} />
      <span class="font-mono text-xs text-[var(--terra-accent-primary)] tracking-widest font-bold">
        [AUTHOR]
      </span>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-12 gap-5 my-4 items-center">
    <div class="sm:col-span-4 flex justify-center">
      <div
        class="relative w-full aspect-[4/5] max-w-[160px] bg-[var(--terra-bg-base)] border border-[var(--terra-border-strong)] overflow-hidden flex flex-col items-center justify-center group"
      >
        <img
          src={avatarUrl}
          alt={username}
          loading="lazy"
          class="terra-t-snappy w-full h-full object-cover group-hover:scale-105"
        />

        <span
          class="absolute top-1 left-1.5 font-mono text-[10px] text-[var(--terra-accent-primary)] opacity-80 pointer-events-none"
          >+</span
        >
        <span
          class="absolute top-1 right-1.5 font-mono text-[10px] text-[var(--terra-accent-primary)] opacity-80 pointer-events-none"
          >+</span
        >

        <div
          class="absolute bottom-0 inset-x-0 bg-[var(--terra-bg-surface)]/95 py-1 px-1.5 flex items-center justify-between font-mono text-[10px] text-[var(--terra-text-muted)] border-t border-[var(--terra-border)]"
        >
          <span>{uid}</span>
          <span class="text-[var(--terra-accent-primary)] font-bold">GH-AUTH</span>
        </div>
      </div>
    </div>

    <div class="sm:col-span-8 flex flex-col justify-between space-y-3">
      <div>
        <div class="flex items-baseline gap-2 flex-wrap">
          <h3
            class="font-display text-3xl sm:text-4xl font-black tracking-tight uppercase text-[var(--terra-text-primary)] leading-none"
          >
            {username}
          </h3>
          {#if nickname}
            <span
              class="font-mono text-sm tracking-wider text-[var(--terra-text-secondary)] font-bold"
            >
              // {nickname}
            </span>
          {/if}
        </div>

        <div
          class="mt-1 font-mono text-xs font-semibold tracking-wider text-[var(--terra-accent-primary)] uppercase flex items-center gap-1.5"
        >
          <span class="w-1.5 h-1.5 bg-[var(--terra-accent-primary)]"></span>
          <span>{displayRole}</span>
        </div>
      </div>

      <div
        class="grid grid-cols-2 gap-2 py-2 px-3 bg-[var(--terra-bg-base)]/50 border border-[var(--terra-border)] font-mono text-[10px]"
      >
        <div>
          <span class="text-[var(--terra-text-muted)] block uppercase">
            {isZh ? '架构定位' : 'ROLE // RESPONSIBILITY'}
          </span>
          <span class="text-[var(--terra-text-primary)] font-semibold truncate block">
            {displayRole}
          </span>
        </div>
        <div>
          <span class="text-[var(--terra-text-muted)] block uppercase">
            {isZh ? '项目归属' : 'CORE SYSTEM'}
          </span>
          <span class="text-[var(--terra-text-primary)] font-semibold truncate block">
            terra-ui // Design System
          </span>
        </div>
        <div>
          <span class="text-[var(--terra-text-muted)] block uppercase">
            {isZh ? '用户标识' : 'SERIAL IDENTIFIER'}
          </span>
          <span class="text-[var(--terra-text-primary)] font-semibold">
            {uid}
          </span>
        </div>
        <div>
          <span class="text-[var(--terra-text-muted)] block uppercase">
            {isZh ? '开源矩阵' : 'REPOSITORIES'}
          </span>
          <span class="text-[var(--terra-accent-primary)] font-semibold">
            {displayStats}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1">
        <TerraBarcode code={uid} serial="K0MARU-GH" height={20} />
      </div>
    </div>
  </div>

  <div
    class="pt-3 border-t border-[var(--terra-border)] flex flex-wrap items-center justify-between gap-3"
  >
    <div class="font-mono text-[10px] text-[var(--terra-text-muted)] tracking-wider">
      {isZh ? 'TERRA UI // 开发者档案 V0.8.0' : 'TERRA UI // DEVELOPER PROFILE V0.8.0'}
    </div>
    <div class="flex items-center gap-2">
      <TerraButton variant="outline" size="sm" onclick={openGithub}>GITHUB PROFILE</TerraButton>
      <TerraButton variant="primary" size="sm" onclick={openRepo}>REPOSITORY</TerraButton>
    </div>
  </div>
</div>
