import * as React from "react";
import { HeroSection } from "@/components/agptui/composite/HeroSection";
import { FeaturedSection } from "@/components/agptui/composite/FeaturedSection";
import {
  AgentsSection,
  Agent,
} from "@/components/agptui/composite/AgentsSection";
import { BecomeACreator } from "@/components/agptui/BecomeACreator";
import {
  FeaturedCreators,
  FeaturedCreator,
} from "@/components/agptui/composite/FeaturedCreators";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import {
  StoreAgentsResponse,
  CreatorsResponse,
} from "@/lib/autogpt-server-api/types";
import BackendAPI from "@/lib/autogpt-server-api";

async function getStoreData() {
  try {
    const api = new BackendAPI();

    // Add error handling and default values
    let featuredAgents: StoreAgentsResponse = {
      agents: [],
      pagination: {
        total_items: 0,
        total_pages: 0,
        current_page: 0,
        page_size: 0,
      },
    };
    let topAgents: StoreAgentsResponse = {
      agents: [],
      pagination: {
        total_items: 0,
        total_pages: 0,
        current_page: 0,
        page_size: 0,
      },
    };
    let featuredCreators: CreatorsResponse = {
      creators: [],
      pagination: {
        total_items: 0,
        total_pages: 0,
        current_page: 0,
        page_size: 0,
      },
    };

    try {
      [featuredAgents, topAgents, featuredCreators] = await Promise.all([
        api.getStoreAgents({ featured: true }),
        api.getStoreAgents({ sorted_by: "runs" }),
        api.getStoreCreators({ featured: true, sorted_by: "num_agents" }),
      ]);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }

    return {
      featuredAgents,
      topAgents,
      featuredCreators,
    };
  } catch (error) {
    console.error("Error in getStoreData:", error);
    return {
      featuredAgents: {
        agents: [],
        pagination: {
          total_items: 0,
          total_pages: 0,
          current_page: 0,
          page_size: 0,
        },
      },
      topAgents: {
        agents: [],
        pagination: {
          total_items: 0,
          total_pages: 0,
          current_page: 0,
          page_size: 0,
        },
      },
      featuredCreators: {
        creators: [],
        pagination: {
          total_items: 0,
          total_pages: 0,
          current_page: 0,
          page_size: 0,
        },
      },
    };
  }
}

// Updated metadata with your custom branding
export const metadata: Metadata = {
  title: "My AI Marketplace - Custom AutoGPT",
  description: "A personalized collection of AI agents for everyone, no login required",
  applicationName: "My Custom AutoGPT Platform",
  authors: [{ name: "Your Name" }],
  keywords: [
    "AI agents",
    "automation",
    "artificial intelligence",
    "AutoGPT",
    "marketplace",
    "personal collection",
    "no login required",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "My AI Marketplace - Custom AutoGPT",
    description: "A personalized collection of AI agents for everyone, no login required",
    type: "website",
    siteName: "My Custom AutoGPT Platform",
    images: [
      {
        url: "/images/store-og.png",
        width: 1200,
        height: 630,
        alt: "My Custom AutoGPT Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My AI Marketplace - Custom AutoGPT",
    description: "A personalized collection of AI agents for everyone, no login required",
    images: ["/images/store-twitter.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function Page({}: {}) {
  // Get data server-side
  const { featuredAgents, topAgents, featuredCreators } = await getStoreData();

  return (
    <div className="mx-auto w-screen max-w-[1360px]">
      <main className="px-4">
        <HeroSection />
        <FeaturedSection featuredAgents={featuredAgents.agents} />
        {/* 100px margin because our featured sections button are placed 40px below the container */}
        <Separator className="mb-6 mt-24" />
        <AgentsSection
          sectionTitle="Top Agents"
          agents={topAgents.agents as Agent[]}
        />
        <Separator className="mb-[25px] mt-[60px]" />
        <FeaturedCreators
          featuredCreators={featuredCreators.creators as FeaturedCreator[]}
        />
        <Separator className="mb-[25px] mt-[60px]" />
        <BecomeACreator
          title="Join My Custom AI Community"
          description="Start building your own AI agents and share them with others"
          buttonText="Get Started"
        />
      </main>
    </div>
  );
}
