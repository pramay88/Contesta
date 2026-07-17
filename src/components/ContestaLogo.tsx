import Image from "next/image";

export function ContestaLogo({ className = "w-9 h-9", }: { className?: string; }) {
    return (
        <Image
            src="/contesta-logo.png"
            alt="ContestForge Logo"
            width={36}
            height={36}
            className={`${className} object-contain shrink-0`}
        />
    );
}