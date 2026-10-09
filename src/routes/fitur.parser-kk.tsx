import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { CreateKKDialog } from '@/components/kk/create/create-kk-dialog'
import { KKParserHeader } from '@/components/kk/parser/kk-parser-header'
import { ParserInputCard } from '@/components/kk/parser/parser-input-card'
import { ParserPreviewCard } from '@/components/kk/parser/parser-preview-card'
import { ParserSaveCard } from '@/components/kk/parser/parser-save-card'
import { ParserValidationCard } from '@/components/kk/parser/parser-validation-card'
import { PrivacyNotice } from '@/components/kk/parser/privacy-notice'

import { useKKParser } from '@/hooks/use-kk-parser'

export const Route = createFileRoute('/fitur/parser-kk')({
  component: ParserKKPage,
})

function ParserKKPage() {
  const parser = useKKParser()

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <main className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* HEADER */}
        <KKParserHeader onAddManual={() => setCreateOpen(true)} />
        {/* PRIVACY */}
        <div className="mb-6">
          <PrivacyNotice />
        </div>

        {/* PARSER WORKSPACE */}
        <section className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="min-w-0">
            <ParserInputCard
              text={parser.text}
              error={parser.parseError}
              canClear={parser.canClear}
              onTextChange={parser.setText}
              onParse={parser.handleParse}
              onClear={parser.handleClear}
            />
          </div>

          <div className="min-w-0">
            <ParserPreviewCard
              data={parser.previewData}
              isValid={parser.isValid}
              showSensitive={parser.showSensitive}
              onToggleSensitive={parser.toggleSensitive}
              onCopy={parser.handleCopy}
            />
          </div>
        </section>

        {/* RESULT */}
        {parser.result && (
          <section className="mt-6 space-y-6">
            <ParserValidationCard
              isValid={parser.isValid}
              errors={parser.validationErrors}
            />

            <ParserSaveCard
              canSave={parser.canSave}
              isSaving={parser.isSaving}
              isSaved={parser.isSaved}
              onSave={parser.handleSave}
            />
          </section>
        )}
      </div>

      <CreateKKDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          setCreateOpen(false)
        }}
      />
    </main>
  )
}
