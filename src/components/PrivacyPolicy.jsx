import { useEffect } from 'react'

// The policy lives on the main site so there is only one version to maintain.
const URL = 'https://theprivacyblueprint.co.uk/privacy-policy/'

export default function PrivacyPolicy() {
  useEffect(() => { window.location.replace(URL) }, [])
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5 bg-sand">
      <p className="font-raleway text-sm text-ink/75">
        Taking you to our policy on <a href={URL} className="text-navy font-semibold border-b border-brass">theprivacyblueprint.co.uk</a>
      </p>
    </div>
  )
}
