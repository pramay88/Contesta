import { getPlatformOptions } from '@/lib/platforms';
import { PlatformIcon } from './PlatformIcon';

const platforms = getPlatformOptions('contest');

// Repeat the set enough times that the track always exceeds viewport width,
// so the loop never runs out of logos before it repeats.
const COPIES = 4;
const track = Array.from({ length: COPIES }).flatMap(() => platforms);

export function PlatformMarquee() {
    return (
        <section>
            <div className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-(--text-muted)">
                Supported platforms
            </div>

            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <div className="flex w-max items-center motion-safe:animate-[cf-marquee_34s_linear_infinite] hover:[animation-play-state:paused]">
                    {track.map((platform, index) => (
                        <div key={`${platform.value}-${index}`} className="flex shrink-0 flex-col items-center gap-2 px-10">
                            <PlatformIcon resource={platform.value} className="h-9 w-9" />
                            <span className="text-sm font-medium text-(--text-secondary)">{platform.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* translateX by exactly 1/COPIES of the track width — since every copy is
          identical, the frame at the loop point is pixel-identical to the start. */}
            <style>{`
        @keyframes cf-marquee {
          to { transform: translateX(calc(-100% / ${COPIES})); }
        }
      `}</style>
        </section>
    );
}