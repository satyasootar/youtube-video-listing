import { Compass } from 'lucide-react';

export default function Explore() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-6 bg-muted rounded-full mb-6">
        <Compass className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Explore New Content</h1>
      <p className="text-muted-foreground max-w-md">
        This feature is coming soon. Discover trending videos, new channels, and diverse topics tailored to your interests.
      </p>
    </div>
  );
}
