import {
    MapPin,
    Compass,
    Camera,
    Globe,
    Heart,
    Star,
    Plane,
    Mountain,
    Shield,
    Zap,
    Users,
    Clock,
    Code,
    Settings,
    Rocket,
    Palette,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "map-pin": MapPin,
    compass: Compass,
    camera: Camera,
    globe: Globe,
    heart: Heart,
    star: Star,
    plane: Plane,
    mountain: Mountain,
    shield: Shield,
    zap: Zap,
    users: Users,
    clock: Clock,
    code: Code,
    settings: Settings,
    rocket: Rocket,
    palette: Palette,
};

interface FeaturesBlockProps {
    heading: string;
    description: string;
    items: { icon: string; title: string; description: string }[];
}

export function FeaturesBlock({ heading, description, items }: FeaturesBlockProps) {
    return (
        <section className="py-20 md:py-32 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {heading}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(items ?? []).map((feature, index) => {
                        const FeatureIcon = iconMap[feature.icon] ?? MapPin;
                        return (
                            <div
                                key={index}
                                className="bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all hover:shadow-lg group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <FeatureIcon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
