import Image from "next/image";

interface AuthorBoxProps {
    name: string;
    bio?: string;
    avatar?: string;
}

export function AuthorBox({ name, bio, avatar }: AuthorBoxProps) {
    return (
        <div className="mt-12 p-8 bg-secondary rounded-2xl">
            <div className="flex items-start gap-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                    {avatar ? (
                        <Image src={avatar} alt={name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <span className="font-serif text-2xl font-bold text-primary">
                                {name[0]}
                            </span>
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                        {name}
                    </h3>
                    <p className="text-primary text-sm mb-3">ライター</p>
                    {bio && (
                        <p className="text-muted-foreground">{bio}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
