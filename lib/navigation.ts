
interface NavLink {
  label: string
  href: string
}
interface FooterLinks{
    product:Array<{label:string,href:string}>
    legal:Array<{label:string,href:string}>
}

export const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]
export const footerLinks: FooterLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Demo', href: '#demo' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Use cases', href: '#use-cases' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}