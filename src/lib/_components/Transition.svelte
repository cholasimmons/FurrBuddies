<script lang="ts">
    import { slide, fly, fade, scale } from 'svelte/transition'
  
    export let key: string
    export let duration: number = 300
  </script>
  
  {#key key}
    <div
      in:fade={{ duration, delay: duration+50 }}
      out:fly={{ duration, y:4 }}>
      <slot />
    </div>
  {/key}
  
  <style>
    div {
      position: relative;
      inset: 0;
      height: 100%;
    }
  </style>
  