import { useState, type SubmitEvent } from 'react'
import { getErrorMessage } from '../api/errorMessage'
import type { Channel, NotificationInput } from '../types'
import { CHANNEL_LABELS } from './labels'

const SMS_MAX_LENGTH = 160

interface Props {
  className?: string
  heading: string
  submitLabel: string
  submittingLabel: string
  // Valores de partida al editar; sin ellos el formulario arranca vacío.
  initialValues?: NotificationInput
  // Crea o actualiza. Si lanza un error, el formulario lo muestra.
  onSubmit: (input: NotificationInput) => Promise<void>
  // Si se pasa, se muestra el botón "Cancelar".
  onCancel?: () => void
}

export function NotificationForm({
  className,
  heading,
  submitLabel,
  submittingLabel,
  initialValues,
  onSubmit,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [channel, setChannel] = useState<Channel>(initialValues?.channel ?? 'email')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // [...texto] cuenta caracteres como el backend; .length cuenta doble los emojis.
  const contentLength = [...content].length
  // El backend responde 500 si un SMS supera el límite, así que lo frenamos acá.
  const smsTooLong = channel === 'sms' && contentLength > SMS_MAX_LENGTH

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!title.trim() || !content.trim()) {
      setError('Completa el título y el contenido.')
      return
    }
    if (smsTooLong) return

    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), content, channel })
      // Se conserva el canal elegido para crear varias seguidas.
      setTitle('')
      setContent('')
    } catch (err) {
      setError(
        getErrorMessage(err, {
          400: 'Revisa los datos de la notificación.',
          404: 'Esta notificación ya no existe. Recarga la página.',
        }),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <h2>{heading}</h2>
      {/* disabled evita editar durante el envío y perder esos cambios al limpiar */}
      <fieldset disabled={submitting}>
        <label>
          Título
          <input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Contenido
          <textarea required value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
        {channel === 'sms' && (
          <p role={smsTooLong ? 'alert' : undefined}>
            {contentLength}/{SMS_MAX_LENGTH} caracteres
            {smsTooLong && '. El contenido es demasiado largo para un SMS.'}
          </p>
        )}
        <label>
          Canal
          <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
            {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {error && <p role="alert">{error}</p>}
        <div className="actions">
          <button type="submit" disabled={smsTooLong}>
            {submitting ? submittingLabel : submitLabel}
          </button>
          {onCancel && (
            <button type="button" className="secondary" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </fieldset>
    </form>
  )
}
