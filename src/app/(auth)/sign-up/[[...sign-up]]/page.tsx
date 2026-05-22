import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0EB' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-2xl" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: '#8B7355' }}>
            The Privacy Blueprint
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(44,44,44,0.5)' }}>Agency Platform</p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
