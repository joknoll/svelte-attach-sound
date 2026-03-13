# svelte-attach-sound

A Svelte attachment for binding sound playback to DOM events using the [Svelte 5 attachments API](https://svelte.dev/docs/svelte/attachments).

Uses [Howler.js](https://howlerjs.com/) as a peer dependency.

Find CC-Zero licensed sounds at [freesound.org](https://freesound.org/)

## Installation

```
npm install svelte-attach-sound howler
```

## Example

```svelte
<script lang="ts">
  import { sound, useSound } from "svelte-attach-sound";
  import click_mp3 from "$lib/assets/click.mp3";

  const click = useSound(click_mp3, ["pointerdown"]);
</script>

<!-- Inline -->
<button {@attach sound({ src: click_mp3, events: ["click"] })}>Click</button>

<!-- Factory: reusable with shared defaults -->
<button {@attach click()}>Click</button>
<button {@attach click({ volume: 0.5 })}>Click (quieter)</button>
```

[Demo](https://joknoll.github.io/svelte-attach-sound/) | [npm](https://www.npmjs.com/package/svelte-attach-sound)

## API

### `sound(options)`

Svelte attachment that plays a sound on a DOM event.

| Option    | Type                                                           | Required | Description                                        |
| --------- | -------------------------------------------------------------- | -------- | -------------------------------------------------- |
| `src`     | `string \| string[]`                                           | Yes      | Audio file URL(s), with fallbacks                  |
| `events`  | `[playEvent, stopEvent?]`                                      | Yes      | DOM event to trigger play, and optionally stop     |
| `...rest` | [`HowlOptions`](https://github.com/goldfire/howler.js#options) | No       | Any Howler option (`volume`, `loop`, `rate`, etc.) |

### `useSound(src, events, options?)`

Factory that returns a reusable attachment with preset defaults. The returned function accepts optional per-call overrides.

```svelte
<script lang="ts">
  const click = useSound(click_mp3, ["pointerdown"], { volume: 0.8 });
</script>

<button {@attach click()}>Uses defaults</button>
<button {@attach click({ volume: 0.3 })}>Override volume</button>
```

### `Sound` class

For manual control outside of attachments:

```ts
import { Sound } from "svelte-attach-sound";

const s = new Sound(click_mp3, { volume: 0.5 });
s.play();
s.stop();
s.destroy(); // stops playback and frees resources
```
