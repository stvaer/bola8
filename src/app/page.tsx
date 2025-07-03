import { Magic8Ball } from '@/components/magic-8-ball';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="text-center mb-8">
        <p className="text-muted-foreground mt-2 max-w-md">
          Agita tu dispositivo o presiona el botón para obtener una respuesta del más allá.
        </p>
      </div>
      <Magic8Ball />
    </main>
  );
}
