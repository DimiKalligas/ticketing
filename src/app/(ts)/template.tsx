// a template renders every time
export default async function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // the animation
    <div className="animate-appear">
        {children}
    </div>
  )
}
