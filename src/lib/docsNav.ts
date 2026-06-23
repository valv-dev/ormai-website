export interface DocsItem {
	label: string;
	href: string;
}

export interface DocsGroup {
	group: string;
	items: DocsItem[];
}

// Single source of truth for the docs sidebar. Page stubs are generated from
// this list, so adding an item here + a matching .mdx keeps them in sync.
export const docsNav: DocsGroup[] = [
	{
		group: "Get started",
		items: [
			{ label: "Introduction", href: "/docs/" },
			{ label: "Installation", href: "/docs/installation/" },
			{ label: "Quickstart", href: "/docs/quickstart/" },
		],
	},
	{
		group: "Core concepts",
		items: [
			{ label: "How it works", href: "/docs/how-it-works/" },
			{ label: "Schema", href: "/docs/schema/" },
			{ label: "Policies", href: "/docs/policies/" },
			{ label: "Queries", href: "/docs/queries/" },
			{ label: "Writes", href: "/docs/writes/" },
		],
	},
	{
		group: "In your app",
		items: [
			{ label: "Tools & providers", href: "/docs/tools/" },
			{ label: "MCP in your app", href: "/docs/mcp-sdk/" },
		],
	},
	{
		group: "Coding agents",
		items: [{ label: "MCP server", href: "/docs/mcp-server/" }],
	},
	{
		group: "Going further",
		items: [
			{ label: "Saved queries & dashboards", href: "/docs/saved-queries/" },
			{ label: "Adapters & databases", href: "/docs/adapters/" },
		],
	},
];
