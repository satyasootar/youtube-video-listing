import { PlaySquare } from 'lucide-react';

export default function Subscriptions() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-6 bg-muted rounded-full mb-6">
        <PlaySquare className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Your Subscriptions</h1>
      <p className="text-muted-foreground max-w-md">
        Videos from your favorite channels will appear here once you start subscribing.
      </p>
    </div>
  );
}
