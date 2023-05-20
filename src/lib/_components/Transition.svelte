<script lang="ts">
    import { slide, fly, fade } from 'svelte/transition'
  
    export let key: string
    export let duration: number = 300
  </script>
  
  {#key key}
    <div class="pt-20 md:pt-0"
      in:fly={{ duration, delay: duration }}
      out:fly={{ duration }}>
      <slot />
    </div>
  {/key}
  
  <style>
    div {
      position: absolute;
      inset: 0;
    }
  </style>
  