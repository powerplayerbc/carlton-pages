'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { OfferForm, FormField } from '@/lib/types'

interface FormRendererProps {
  formId: string
  offerId: string
  pageId: string
  slug: string
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'carlton_visitor_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

export function FormRenderer({ formId, offerId, pageId, slug }: FormRendererProps) {
  const [form, setForm] = useState<OfferForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string | boolean>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

  // Fetch form definition on mount
  useEffect(() => {
    async function fetchForm() {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('offer_forms')
        .select('*')
        .eq('form_id', formId)
        .single()

      if (fetchError || !data) {
        setError('Failed to load form. Please refresh the page.')
        setLoading(false)
        return
      }

      setForm(data as OfferForm)
      setLoading(false)
    }

    fetchForm()
  }, [formId])

  // Build a stable field key from index and label
  const fieldKey = useCallback((index: number, label: string) => {
    return `${index}_${label}`
  }, [])

  // Update a field value
  const updateValue = useCallback((key: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setTouched((prev) => new Set(prev).add(key))
  }, [])

  // Check if a field is valid
  const isFieldValid = useCallback(
    (field: FormField, key: string): boolean => {
      if (!field.required) return true
      const val = values[key]
      if (val === undefined || val === '' || val === false) return false
      return true
    },
    [values]
  )

  // Find the customer name and email from form values
  const extractCustomerInfo = useCallback((): { name: string; email: string } => {
    if (!form) return { name: '', email: '' }

    let name = ''
    let email = ''

    form.fields.forEach((field, i) => {
      const key = fieldKey(i, field.label)
      const val = values[key]
      if (typeof val !== 'string') return

      if (field.type === 'email') {
        email = val
      } else if (
        field.label.toLowerCase().includes('name') &&
        !field.label.toLowerCase().includes('company') &&
        !field.label.toLowerCase().includes('business')
      ) {
        name = val
      }
    })

    return { name, email }
  }, [form, values, fieldKey])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    setAttemptedSubmit(true)

    // Validate all required fields
    const allValid = form.fields.every((field, i) =>
      isFieldValid(field, fieldKey(i, field.label))
    )

    if (!allValid) {
      setError('Please fill in all required fields.')
      return
    }

    setError(null)
    setSubmitting(true)

    // Build responses array
    const responses = form.fields.map((field, i) => {
      const key = fieldKey(i, field.label)
      const rawValue = values[key]
      return {
        question: field.label,
        answer: rawValue !== undefined ? String(rawValue) : '',
        scoring_weight: field.scoring_weight ?? 0,
      }
    })

    const { name: customerName, email: customerEmail } = extractCustomerInfo()

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: formId,
          offer_id: offerId,
          page_id: pageId,
          slug,
          customer_name: customerName,
          customer_email: customerEmail,
          responses,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Submission failed')
      }

      // Track form_submit event
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'form_submit',
            page_id: pageId,
            slug,
            visitor_id: getVisitorId(),
            metadata: { form_id: formId, offer_id: offerId },
          }),
        })
      } catch {
        // Analytics should never break the submission flow
      }

      setSubmitted(true)

      // Redirect if configured
      if (form.redirect_url) {
        setTimeout(() => {
          window.location.href = form.redirect_url!
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-600 border-t-accent-400" />
      </div>
    )
  }

  // Error loading form
  if (!form) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <p className="text-red-400">{error ?? 'Form not found.'}</p>
      </div>
    )
  }

  // Success state
  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center sm:p-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <svg
            className="h-8 w-8 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white">
          {form.thank_you_message ?? 'Thank you for your submission!'}
        </h3>
        <p className="mt-3 text-navy-300">
          {form.redirect_url
            ? 'You will be redirected shortly...'
            : 'We will be in touch soon.'}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      aria-label={form.title}
    >
      {form.fields.map((field, i) => {
        const key = fieldKey(i, field.label)
        const showError =
          field.required &&
          (attemptedSubmit || touched.has(key)) &&
          !isFieldValid(field, key)

        return (
          <div key={key}>
            <FormFieldRenderer
              field={field}
              fieldKey={key}
              value={values[key]}
              onChange={(val) => updateValue(key, val)}
              showError={showError}
            />
          </div>
        )
      })}

      {error && (
        <div
          className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-200 hover:bg-accent-400 hover:shadow-accent-400/30 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" />
            Submitting...
          </span>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  )
}

// ── Individual field renderers ─────────────────────────────────────────────

interface FormFieldRendererProps {
  field: FormField
  fieldKey: string
  value: string | boolean | undefined
  onChange: (value: string | boolean) => void
  showError: boolean
}

function FormFieldRenderer({
  field,
  fieldKey,
  value,
  onChange,
  showError,
}: FormFieldRendererProps) {
  const labelId = `label-${fieldKey}`
  const inputId = `input-${fieldKey}`
  const errorBorder = showError ? 'border-red-500/50' : 'border-navy-700/40'

  const labelEl = (
    <label htmlFor={inputId} id={labelId} className="mb-2 block text-sm font-medium text-navy-200">
      {field.label}
      {field.required && <span className="ml-1 text-red-400" aria-hidden="true">*</span>}
    </label>
  )

  const baseInputClass = `w-full rounded-xl border bg-navy-900/60 px-4 py-3 text-white placeholder-navy-500 outline-none transition-colors duration-150 focus:border-accent-400/60 focus:ring-1 focus:ring-accent-400/30 ${errorBorder}`

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return (
        <div>
          {labelEl}
          <input
            id={inputId}
            type={field.type}
            placeholder={field.placeholder ?? ''}
            required={field.required}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClass}
            aria-required={field.required}
            aria-invalid={showError}
          />
          {showError && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              This field is required.
            </p>
          )}
        </div>
      )

    case 'textarea':
      return (
        <div>
          {labelEl}
          <textarea
            id={inputId}
            placeholder={field.placeholder ?? ''}
            required={field.required}
            rows={4}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClass} resize-y`}
            aria-required={field.required}
            aria-invalid={showError}
          />
          {showError && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              This field is required.
            </p>
          )}
        </div>
      )

    case 'select':
      return (
        <div>
          {labelEl}
          <select
            id={inputId}
            required={field.required}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
            aria-required={field.required}
            aria-invalid={showError}
          >
            <option value="">{field.placeholder ?? 'Select an option...'}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {showError && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              Please select an option.
            </p>
          )}
        </div>
      )

    case 'radio':
      return (
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-navy-200">
            {field.label}
            {field.required && <span className="ml-1 text-red-400" aria-hidden="true">*</span>}
          </legend>
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-150 ${
                  value === opt
                    ? 'border-accent-400/40 bg-accent-400/5'
                    : `${errorBorder} bg-navy-900/40 hover:bg-navy-800/40`
                }`}
              >
                <input
                  type="radio"
                  name={fieldKey}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                  className="h-4 w-4 border-navy-600 bg-navy-900 text-accent-500 focus:ring-accent-400/30"
                  aria-required={field.required}
                />
                <span className="text-sm text-white">{opt}</span>
              </label>
            ))}
          </div>
          {showError && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              Please select an option.
            </p>
          )}
        </fieldset>
      )

    case 'checkbox':
      if (field.options && field.options.length > 1) {
        // Checkbox group: store as comma-separated string
        const selected = typeof value === 'string' ? value.split(',').filter(Boolean) : []
        return (
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-navy-200">
              {field.label}
              {field.required && <span className="ml-1 text-red-400" aria-hidden="true">*</span>}
            </legend>
            <div className="space-y-2">
              {field.options.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-150 ${
                    selected.includes(opt)
                      ? 'border-accent-400/40 bg-accent-400/5'
                      : `${errorBorder} bg-navy-900/40 hover:bg-navy-800/40`
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={selected.includes(opt)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...selected, opt]
                        : selected.filter((s) => s !== opt)
                      onChange(next.join(','))
                    }}
                    className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-accent-500 focus:ring-accent-400/30"
                  />
                  <span className="text-sm text-white">{opt}</span>
                </label>
              ))}
            </div>
            {showError && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                Please select at least one option.
              </p>
            )}
          </fieldset>
        )
      }

      // Single checkbox (boolean toggle)
      return (
        <div>
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-150 ${
              value === true
                ? 'border-accent-400/40 bg-accent-400/5'
                : `${errorBorder} bg-navy-900/40 hover:bg-navy-800/40`
            }`}
          >
            <input
              id={inputId}
              type="checkbox"
              checked={value === true}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-accent-500 focus:ring-accent-400/30"
              aria-required={field.required}
              aria-invalid={showError}
            />
            <span className="text-sm text-white">
              {field.label}
              {field.required && <span className="ml-1 text-red-400" aria-hidden="true">*</span>}
            </span>
          </label>
          {showError && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              This field is required.
            </p>
          )}
        </div>
      )

    default:
      return null
  }
}
