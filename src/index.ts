import type { HowlOptions, Howl as HowlClass } from "howler";
import type { Attachment } from "svelte/attachments";

type SoundSource = HowlOptions["src"];
type SoundEvents = [keyof HTMLElementEventMap, (keyof HTMLElementEventMap)?];
type SoundOptions = Omit<HowlOptions, "src">;

/**
 * Options for the sound attachment factory.
 */
type Options = {
  events: SoundEvents;
} & HowlOptions;

/**
 * A class representing a synthetic sound.
 * Can be used standalone for programmatic playback without any DOM dependency.
 */
export class Sound {
  private config: HowlOptions;
  private howl: HowlClass | undefined;
  private ready: Promise<void>;

  constructor(src: SoundSource, options: SoundOptions = {}) {
    this.config = { ...options, src };
    this.ready = this.create();
  }

  private whenReady(fn: () => void) {
    void this.ready.then(fn).catch(() => {});
  }

  private async create() {
    const { Howl } = (await import("howler/src/howler.core" as string)) as {
      Howl: typeof HowlClass;
    };
    this.howl = new Howl(this.config);
  }

  play() {
    this.whenReady(() => this.howl?.play());
  }

  stop() {
    this.whenReady(() => this.howl?.stop());
  }

  destroy() {
    this.whenReady(() => {
      this.howl?.stop();
      this.howl?.unload();
    });
  }
}

/**
 * Creates a sound attachment that binds playback to DOM events on the element.
 *
 * Runs inside a Svelte effect — if options contain reactive state, the attachment
 * will automatically tear down and recreate when that state changes.
 *
 * @param options Options including `src`, `events`, and any Howler options.
 * @returns A Svelte attachment.
 *
 * @example
 * ```svelte
 * <button {@attach sound({ src: click_mp3, events: ["click"] })}>
 *   Click me
 * </button>
 * ```
 */
export function sound(options: Options): Attachment<HTMLElement> {
  return (element: HTMLElement) => {
    const { src, events, ...howlOptions } = options;
    const [playEvent, stopEvent] = events;

    const instance = new Sound(src, howlOptions);

    const handlePlay = () => instance.play();
    const handleStop = () => instance.stop();

    element.addEventListener(playEvent, handlePlay);
    if (stopEvent) {
      element.addEventListener(stopEvent, handleStop);
    }

    return () => {
      element.removeEventListener(playEvent, handlePlay);
      if (stopEvent) {
        element.removeEventListener(stopEvent, handleStop);
      }
      instance.destroy();
    };
  };
}

/**
 * Creates a pre-configured sound attachment factory that can be reused across
 * multiple elements with optional per-element overrides.
 *
 * @param src The source URL(s) of the sound.
 * @param events The `[playEvent, stopEvent?]` tuple.
 * @param options Optional base Howler options.
 * @returns A factory function that returns a Svelte attachment.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useSound } from "svelte-attach-sound";
 *   import click_mp3 from "./assets/click.mp3";
 *
 *   const click = useSound(click_mp3, ["click"]);
 * </script>
 *
 * <button {@attach click()}>Click me</button>
 *
 * <!-- Override options per-element -->
 * <button {@attach click({ volume: 0.5 })}>Click me (quieter)</button>
 * ```
 */
export function useSound(src: SoundSource, events: SoundEvents, options?: SoundOptions) {
  return (overrideOptions?: Partial<Options>): Attachment<HTMLElement> =>
    sound({ src, events, ...options, ...overrideOptions });
}
