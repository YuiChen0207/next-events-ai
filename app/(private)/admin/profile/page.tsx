/**
 * Render the Admin Profile page.
 *
 * @returns The JSX element that contains the admin profile layout, including the page heading and a content card where profile settings appear.
 */
export default function AdminProfilePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>
      <div className="bg-card rounded-lg border p-6">
        <p className="text-muted-foreground">
          Admin profile settings will appear here.
        </p>
      </div>
    </div>
  );
}