import ContestDetails from "@/components/contests/ContestDetails";
import apiClient from "@/services/Api"; 

// Change the function signature to get rid of the destructuring
export async function generateMetadata(props) {
  // First await the params object
  const params = await props.params;
  const id = params.id;

  if (!id) {
    return {
      title: "Contests - PCC Online Judge",
      description: "Explore exciting programming contests hosted by PCC Online Judge.",
    };
  }

  try {
    const response = await apiClient.get(`/contest/${id}/`); 
    const contest = response.data;

    return {
      title: contest?.title || "Contests - PCC Online Judge",
      description: contest?.description || "Explore exciting programming contests hosted by PCC Online Judge.",
      keywords: ["programming contests", "competitive programming", "PCC Online Judge", "coding challenges"],
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error("Error fetching contest metadata:", error);
    return {
      title: "Contests - PCC Online Judge",
      description: "Explore exciting programming contests hosted by PCC Online Judge.",
      keywords: ["programming contests", "competitive programming", "PCC Online Judge", "coding challenges"],
    };
  }
}

export async function generateStaticParams() {
  try {
    const response = await apiClient.get("/contest/"); 
    return response.data.map((contest) => ({ id: contest.id.toString() }));
  } catch (error) {
    console.error("Error fetching contest IDs:", error);
    return [];
  }
}

export default function Page() {
  return (
    <>
      <ContestDetails />
    </>
  );
}