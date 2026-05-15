import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const FEATURE_DATA: Record<string, { title: string; description: string; detail: string }> = {
  "ai-photo-restoration": {
    title: "AI Family Photo Creator",
    description: "Turn individual photos into a single family portrait.",
    detail: "Our AI analyzes facial features to create a realistic composite image of your heritage."
  },
  "relation-finder": {
    title: "Kinship Relation Finder",
    description: "Discover exactly how you are related to anyone in your tree.",
    detail: "Enter two names and our algorithm calculates the precise degree of kinship."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;  
  const feature = FEATURE_DATA[slug];
  
  if (!feature) return { title: "Feature Not Found" };

  return {
    title: `${feature.title} | MyFamilyApp`,
    description: feature.description,
  };
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;  
  const feature = FEATURE_DATA[slug];

  if (!feature) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{feature.title}</h1>
      <p style={{ fontSize: "1.2rem", color: "#666" }}>{feature.description}</p>
      <div style={{ marginTop: "2rem", border: "1px solid #ddd", padding: "1rem" }}>
        <h3>How it works:</h3>
        <p>{feature.detail}</p>
      </div>
    </main>
  );
}