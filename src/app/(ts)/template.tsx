// a template renders every time
export default async function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // smooth entrance animation from shadcn's animation utilities
    <div className="animate-in fade-in zoom-in-95">
        {children}
    </div>
  )
}
