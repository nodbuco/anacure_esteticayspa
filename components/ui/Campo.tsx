import { cn } from "@/lib/cn";

export const CLASE_CAMPO =
  "w-full rounded-[0.9rem] border border-linea bg-blanco px-4 py-3 text-tinta placeholder:text-gris-claro outline-none transition-[border-color,box-shadow] duration-200 focus:border-purpura focus:ring-4 focus:ring-purpura/15 aria-[invalid=true]:border-red-500";

type Base = {
  etiqueta: string;
  nombre: string;
  error?: string;
  ayuda?: string;
  opcional?: boolean;
  className?: string;
};

type ComoInput = Base & { multilinea?: false } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "className">;
type ComoTextarea = Base & { multilinea: true } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "className">;

/** Campo de formulario con etiqueta, ayuda y error accesibles. */
export function Campo(props: ComoInput | ComoTextarea) {
  const { etiqueta, nombre, error, ayuda, opcional, className, multilinea, ...resto } = props;
  const idError = `${nombre}-error`;
  const idAyuda = `${nombre}-ayuda`;
  const describedBy = [error ? idError : null, ayuda ? idAyuda : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={nombre} className="flex items-baseline justify-between text-sm font-medium text-tinta">
        <span>{etiqueta}</span>
        {opcional && <span className="text-xs font-normal text-gris">Opcional</span>}
      </label>
      {multilinea ? (
        <textarea
          id={nombre}
          name={nombre}
          className={cn(CLASE_CAMPO, "min-h-28 resize-y")}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...(resto as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={nombre}
          name={nombre}
          className={CLASE_CAMPO}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...(resto as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {ayuda && !error && (
        <p id={idAyuda} className="text-xs text-gris">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
