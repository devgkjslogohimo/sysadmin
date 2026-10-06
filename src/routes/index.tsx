import { createFileRoute } from '@tanstack/react-router'

import { KKParserHeader } from '@/components/kk/parser/kk-parser-header'
import { ParserInputCard } from '@/components/kk/parser/parser-input-card'
import { ParserPreviewCard } from '@/components/kk/parser/parser-preview-card'
import { ParserSaveCard } from '@/components/kk/parser/parser-save-card'
import { ParserValidationCard } from '@/components/kk/parser/parser-validation-card'
import { PrivacyNotice } from '@/components/kk/parser/privacy-notice'

import { useKKParser } from '@/hooks/use-kk-parser'
import { useState } from 'react'
import { CreateKKDialog } from '#/components/kk/create/create-kk-dialog'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const parser = useKKParser()

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50/80">
      <div className="mx-auto w-full max-w-350 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <KKParserHeader onAddManual={() => setCreateOpen(true)} />

        <PrivacyNotice />

        <section className="grid min-w-0 gap-6 lg:grid-cols-2">
          <ParserInputCard
            text={parser.text}
            error={parser.parseError}
            canClear={parser.canClear}
            onTextChange={parser.setText}
            onParse={parser.handleParse}
            onClear={parser.handleClear}
          />

          <ParserPreviewCard
            data={parser.previewData}
            isValid={parser.isValid}
            showSensitive={parser.showSensitive}
            onToggleSensitive={parser.toggleSensitive}
            onCopy={parser.handleCopy}
          />
        </section>

        {parser.result && (
          <div className="mt-6">
            <ParserValidationCard
              isValid={parser.isValid}
              errors={parser.validationErrors}
            />
          </div>
        )}

        <div className="mt-6">
          <ParserSaveCard
            canSave={parser.canSave}
            isSaving={parser.isSaving}
            isSaved={parser.isSaved}
            onSave={parser.handleSave}
          />
        </div>
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
