import { Magic8Ball } from '@/components/magic-8-ball';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground dark:text-primary font-headline tracking-tight">
          La Bola Mágica
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          Agita tu dispositivo o presiona el botón para obtener una respuesta del más allá.
        </p>
      </div>
      <Magic8Ball />
    </main>
  );
}
