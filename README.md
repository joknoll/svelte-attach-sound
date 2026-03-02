# svelte-attach-sound

Add sound effects to svelte components.

**Example**

```svelte
<script lang="ts">
  import { sound } from "svelte-attach-sound";
  import click_mp3 from "$lib/assets/click.opus";
</script>

<button {@attach sound({ src: click_mp3, events: ["click"] })}>
  Single click sound
</button>
```

For a more advanced example look at the [playground](/playground/src/routes/+page.svelte).

[Demo](https://knolljo.github.io/svelte-attach-sound/)

[npm Package](https://www.npmjs.com/package/svelte-attach-sound)
