/**
 * Renders the Help & Support page layout.
 *
 * @returns The page's JSX containing a container with a header and a card placeholder for help articles and support resources.
 */
export default function UserHelpPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
      <div className="bg-card rounded-lg border p-6">
        <p className="text-muted-foreground">
          Help articles and support resources will appear here.
        </p>
      </div>
    </div>
  );
}