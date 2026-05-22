import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const VENDORS = [
  { name: 'Google Analytics',   category: 'Analytics',        storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['ISO27001','SOC2'] },
  { name: 'Google Ads',         category: 'Advertising',      storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['ISO27001','SOC2'] },
  { name: 'Google Workspace',   category: 'Productivity',     storageCountries: ['US','EU'], transferSafeguard: 'SCC' as const, securityCertifications: ['ISO27001','SOC2'] },
  { name: 'Google Calendar',    category: 'Productivity',     storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['ISO27001'] },
  { name: 'Meta Pixel',         category: 'Advertising',      storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: [] },
  { name: 'Meta Ads Manager',   category: 'Advertising',      storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: [] },
  { name: 'Mailchimp',          category: 'Email Marketing',  storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['ISO27001','SOC2'] },
  { name: 'HubSpot',            category: 'CRM',              storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['ISO27001','SOC2'] },
  { name: 'Klaviyo',            category: 'Email Marketing',  storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['SOC2'] },
  { name: 'Hotjar',             category: 'Analytics',        storageCountries: ['EU'], transferSafeguard: 'ADEQUACY_DECISION' as const, securityCertifications: ['ISO27001'] },
  { name: 'Stripe',             category: 'Payments',         storageCountries: ['US','EU'], transferSafeguard: 'SCC' as const, securityCertifications: ['ISO27001','SOC2','PCI-DSS'] },
  { name: 'Shopify',            category: 'E-commerce',       storageCountries: ['US','CA'], transferSafeguard: 'SCC' as const, securityCertifications: ['SOC2','PCI-DSS'] },
  { name: 'Beacons',            category: 'E-commerce',       storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: [] },
  { name: 'TikTok for Business',category: 'Advertising',      storageCountries: ['US','SG'], transferSafeguard: 'SCC' as const, securityCertifications: [] },
  { name: 'Notion',             category: 'Productivity',     storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['SOC2'] },
  { name: 'Slack',              category: 'Communication',    storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['ISO27001','SOC2'] },
  { name: 'Zoom',               category: 'Communication',    storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['ISO27001','SOC2'] },
  { name: 'Xero',               category: 'Accounting',       storageCountries: ['NZ','AU','UK'], transferSafeguard: 'ADEQUACY_DECISION' as const, securityCertifications: ['ISO27001'] },
  { name: 'QuickBooks',         category: 'Accounting',       storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['SOC2'] },
  { name: 'Calendly',           category: 'Scheduling',       storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['SOC2'] },
  { name: 'Typeform',           category: 'Forms',            storageCountries: ['EU'], transferSafeguard: 'ADEQUACY_DECISION' as const, securityCertifications: ['ISO27001'] },
  { name: 'Squarespace',        category: 'Website Builder',  storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['SOC2'] },
  { name: 'Wix',                category: 'Website Builder',  storageCountries: ['US','EU'], transferSafeguard: 'SCC' as const, securityCertifications: [] },
  { name: 'Anthropic (Claude)', category: 'AI',               storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['SOC2'] },
  { name: 'OpenAI',             category: 'AI',               storageCountries: ['US'], transferSafeguard: 'SCC' as const,  securityCertifications: ['SOC2'] },
]

async function main() {
  console.log('Seeding vendor library…')

  for (const v of VENDORS) {
    await prisma.vendor.upsert({
      where:  { id: `lib-${v.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id:                    `lib-${v.name.toLowerCase().replace(/\s+/g, '-')}`,
        name:                  v.name,
        category:              v.category,
        isLibraryEntry:        true,
        workspaceId:           null,
        storageCountries:      v.storageCountries,
        transferSafeguard:     v.transferSafeguard,
        securityCertifications: v.securityCertifications,
        role:                  'PROCESSOR',
        assessmentStatus:      'PENDING',
        dpaStatus:             'NOT_IN_PLACE',
      },
    })
  }

  console.log(`Seeded ${VENDORS.length} library vendors.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
