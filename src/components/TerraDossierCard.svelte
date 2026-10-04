<script lang="ts">
  /**
   * @deprecated TerraDossierCard is replaced by TerraTacticalProfile in v0.7.0.
   */
  import TerraTacticalProfile from './TerraTacticalProfile.svelte'

  interface Props {
    codename: string
    nameZh?: string
    archetype: string
    rarity?: number
    clearance?: string
    status?: 'online' | 'standby' | 'alert' | 'offline'
    statusLabel?: string
    uid?: string
    class?: string
    ondeploy?: () => void
    ontelemetry?: () => void
  }

  let {
    codename,
    nameZh,
    archetype,
    rarity = 5,
    clearance,
    status,
    statusLabel,
    uid,
    class: className = '',
    ondeploy,
    ontelemetry
  }: Props = $props()
</script>

<TerraTacticalProfile
  {codename}
  designation={nameZh}
  {archetype}
  tier={rarity}
  {clearance}
  {status}
  {statusLabel}
  {uid}
  class={className}
  {ondeploy}
  {ontelemetry}
/>
