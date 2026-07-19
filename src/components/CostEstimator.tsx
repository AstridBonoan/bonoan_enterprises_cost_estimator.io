import { useMemo, useState } from 'react'
import { ValidationError, useForm } from '@formspree/react'
import {
  calculateEstimate,
  defaultSelections,
  estimatorConfig,
  summarizeSelections,
  type EstimatorSelections,
  type IntegrationLevel,
  type ProjectType,
} from '../data/estimatorConfig'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const inputClasses =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white'

function SectionHeading({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description?: string
}) {
  return (
    <div className="mb-5 flex gap-3">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
        aria-hidden="true"
      >
        {number}
      </span>
      <div>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

function FeatureCheckbox({
  checked,
  label,
  detail,
  price,
  onChange,
}: {
  checked: boolean
  label: string
  detail: string
  price: number
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-400 dark:border-slate-700 dark:hover:border-blue-500">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-slate-900 dark:text-white">{label}</span>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            +{currency.format(price)}
          </span>
        </span>
        <span className="mt-1 block text-sm leading-5 text-slate-500 dark:text-slate-400">
          {detail}
        </span>
      </span>
    </label>
  )
}

export default function CostEstimator() {
  const [selections, setSelections] =
    useState<EstimatorSelections>(defaultSelections)
  // TODO: Replace this placeholder with the Formspree form ID for Bonoan Enterprises.
  const [formState, handleSubmit] = useForm('REPLACE_WITH_FORMSPREE_ID')

  const estimate = useMemo(() => calculateEstimate(selections), [selections])
  const summary = useMemo(
    () => summarizeSelections(selections, estimate),
    [selections, estimate],
  )

  const update = <Key extends keyof EstimatorSelections>(
    key: Key,
    value: EstimatorSelections[Key],
  ) => setSelections((current) => ({ ...current, [key]: value }))

  const selectProjectType = (projectType: ProjectType) => {
    setSelections((current) => ({
      ...current,
      projectType,
      pages: projectType === 'website' ? Math.max(current.pages, 3) : 0,
    }))
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_55%)]" />

      <div className="relative border-b border-blue-500/20 bg-black">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <img
            src={`${import.meta.env.BASE_URL}logo-mark.png`}
            alt=""
            className="h-9 w-auto sm:h-10"
            width={510}
            height={360}
          />
          <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
            Bonoan Enterprises
          </span>
        </div>
      </div>

      <header className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pb-14 lg:pt-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Plan your project with a clearer starting point.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Tell us what you need and get a practical ballpark estimate in a few
            minutes—no hourly-rate math or surprise-sized ranges.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white py-2.5 pl-3 pr-6 shadow-md ring-1 ring-slate-200">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black">
              <img
                src={`${import.meta.env.BASE_URL}logo-mark.png`}
                alt=""
                className="h-5 w-auto"
                width={510}
                height={360}
              />
            </span>
            <span className="text-sm font-bold text-slate-900">
              Powered by Bonoan Enterprises
            </span>
          </div>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-7xl items-start gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:px-8">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <SectionHeading
              number={1}
              title="What are we building?"
              description="Choose the closest fit. You can clarify the details in your message."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(estimatorConfig.projectTypes) as ProjectType[]).map(
                (projectType) => {
                  const project = estimatorConfig.projectTypes[projectType]
                  const active = selections.projectType === projectType
                  return (
                    <button
                      key={projectType}
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectProjectType(projectType)}
                      className={`rounded-xl border p-5 text-left outline-none transition focus:ring-4 focus:ring-blue-500/20 ${
                        active
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-950/40'
                          : 'border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-blue-700'
                      }`}
                    >
                      <span className="block font-bold text-slate-950 dark:text-white">
                        {project.label}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Starting at {currency.format(project.basePrice)}
                      </span>
                      <span className="mt-3 block text-sm leading-5 text-slate-500 dark:text-slate-400">
                        {project.description}
                      </span>
                    </button>
                  )
                },
              )}
            </div>
          </section>

          {selections.projectType === 'website' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <SectionHeading
                number={2}
                title="How many pages?"
                description="The first three pages are included in the website starting price."
              />
              <label
                htmlFor="pages"
                className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Approximate page count
              </label>
              <select
                id="pages"
                value={selections.pages}
                onChange={(event) => update('pages', Number(event.target.value))}
                className={inputClasses}
              >
                {Array.from({ length: 12 }, (_, index) => index + 1).map(
                  (count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? 'page' : 'pages'}
                      {count > 3
                        ? ` (+${currency.format((count - 3) * estimatorConfig.addOns.extraPage)})`
                        : ''}
                    </option>
                  ),
                )}
              </select>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <SectionHeading
              number={selections.projectType === 'website' ? 3 : 2}
              title="What forms will you need?"
              description="Contact forms are covered in the website base. Count additional purpose-built forms here."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Standard forms
                </span>
                <span className="mb-3 block min-h-10 text-sm text-slate-500 dark:text-slate-400">
                  Lead, application, or newsletter forms
                </span>
                <select
                  value={selections.standardForms}
                  onChange={(event) =>
                    update('standardForms', Number(event.target.value))
                  }
                  className={inputClasses}
                >
                  {[0, 1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count} {count ? `(+${currency.format(count * estimatorConfig.addOns.standardForm)})` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Advanced forms
                </span>
                <span className="mb-3 block min-h-10 text-sm text-slate-500 dark:text-slate-400">
                  Quote, intake, or service request forms
                </span>
                <select
                  value={selections.advancedForms}
                  onChange={(event) =>
                    update('advancedForms', Number(event.target.value))
                  }
                  className={inputClasses}
                >
                  {[0, 1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count} {count ? `(+${currency.format(count * estimatorConfig.addOns.advancedForm)})` : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <SectionHeading
              number={selections.projectType === 'website' ? 4 : 3}
              title="Add commerce and automation"
              description="Select only the capabilities this first version needs."
            />
            <div className="space-y-3">
              <FeatureCheckbox
                checked={selections.payment}
                label="Payment / Stripe checkout"
                detail="A secure checkout flow for products or services."
                price={estimatorConfig.addOns.payment}
                onChange={(checked) => update('payment', checked)}
              />
              <FeatureCheckbox
                checked={selections.emailAutomation}
                label="Email automation"
                detail="Automated follow-ups, confirmations, or notifications."
                price={estimatorConfig.addOns.emailAutomation}
                onChange={(checked) => update('emailAutomation', checked)}
              />
              <FeatureCheckbox
                checked={selections.calendarBooking}
                label="Calendar / booking integration"
                detail="Scheduling connected to an external calendar."
                price={estimatorConfig.addOns.calendarBooking}
                onChange={(checked) => update('calendarBooking', checked)}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <SectionHeading
              number={selections.projectType === 'website' ? 5 : 4}
              title="Will it connect to another service?"
              description="Examples include a CRM, external database, business API, or existing platform."
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  ['none', 'No integration', 'No added cost'],
                  ['light', 'Light', 'One straightforward connection'],
                  ['advanced', 'Advanced', 'Custom or multi-step data flow'],
                ] as const
              ).map(([value, label, detail]) => {
                const cost = estimatorConfig.addOns.integration[value]
                return (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      selections.integrationLevel === value
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-950/40'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="integrationLevel"
                      value={value}
                      checked={selections.integrationLevel === value}
                      onChange={() =>
                        update('integrationLevel', value as IntegrationLevel)
                      }
                      className="sr-only"
                    />
                    <span className="block font-semibold text-slate-900 dark:text-white">
                      {label}
                    </span>
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                      {detail}
                    </span>
                    <span className="mt-2 block text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {cost ? `+${currency.format(cost)}` : 'Included'}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <SectionHeading
              number={selections.projectType === 'website' ? 6 : 5}
              title="Do users need private accounts?"
              description="Account and dashboard features add security, roles, data, and workflow complexity."
            />
            <div className="space-y-3">
              <FeatureCheckbox
                checked={selections.userAuthentication}
                label="User authentication / accounts"
                detail="Sign-up, sign-in, password recovery, and protected content."
                price={estimatorConfig.addOns.userAuthentication}
                onChange={(checked) => update('userAuthentication', checked)}
              />
              <FeatureCheckbox
                checked={selections.multiUserDashboard}
                label="Multi-user dashboard"
                detail="Role-aware views, user-specific data, and management screens."
                price={estimatorConfig.addOns.multiUserDashboard}
                onChange={(checked) => update('multiUserDashboard', checked)}
              />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6">
          <div
            className="overflow-hidden rounded-2xl border border-blue-500/30 bg-slate-950 text-white shadow-2xl shadow-blue-950/20"
            aria-live="polite"
          >
            <div className="border-b border-white/10 bg-gradient-to-br from-blue-600/30 to-transparent p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                Live project estimate
              </p>
              <p className="mt-5 text-sm text-slate-300">Estimated investment</p>
              <p className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                {currency.format(estimate.low)} – {currency.format(estimate.high)}
              </p>
              <p className="mt-6 border-l-2 border-blue-400 pl-4 text-lg leading-7 text-slate-100">
                For the scope described, I&apos;d be happy to do this at{' '}
                <strong className="text-white">{currency.format(estimate.midpoint)}</strong>.
              </p>
            </div>

            <div className="space-y-4 border-b border-white/10 p-6 text-sm leading-6 text-slate-300 sm:p-8">
              <p>
                If the project needs heavier integrations, more forms, or complex
                workflows, it moves toward the top of the range.
              </p>
              <p>
                This is an estimate to give you a ballpark. Final pricing is
                confirmed after a short consultation.
              </p>
              <p className="rounded-xl bg-white/5 p-4 text-slate-200">
                <strong className="text-white">Standard terms:</strong> 50% deposit
                to start, with the remainder due on completion before final
                delivery.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {formState.succeeded ? (
                <div role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                  <p className="font-bold text-emerald-300">Thanks for reaching out!</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                    Your project details and estimate were sent. We&apos;ll be in
                    touch to discuss the final scope.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold">Send us your estimate</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Share your details and we&apos;ll follow up about your project.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">Name</span>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        className={inputClasses}
                      />
                    </label>
                    <ValidationError prefix="Name" field="name" errors={formState.errors} />

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">Email</span>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        className={inputClasses}
                      />
                    </label>
                    <ValidationError prefix="Email" field="email" errors={formState.errors} />

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Phone <span className="font-normal text-slate-400">(optional)</span>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        className={inputClasses}
                      />
                    </label>
                    <ValidationError prefix="Phone" field="phone" errors={formState.errors} />

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Anything else we should know?
                      </span>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Timeline, goals, examples, or questions..."
                        className={inputClasses}
                      />
                    </label>
                    <ValidationError prefix="Message" field="message" errors={formState.errors} />

                    <input type="hidden" name="estimate_summary" value={summary} />
                    <ValidationError errors={formState.errors} />

                    <button
                      type="submit"
                      disabled={formState.submitting}
                      className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {formState.submitting ? 'Sending…' : 'Send my project estimate'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
