import { marked } from "marked";

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

export function renderMarkdown(content: string): string {
  return marked.parse(content) as string;
}

// Color-code brief sections based on keywords
export function colorCodeBrief(html: string): string {
  // Blocker sections - red
  html = html.replace(
    /(Blocker|blocked|blocking)/gi,
    '<span class="text-[#DC2626] font-semibold">$1</span>'
  );

  // Progress/completed - green
  html = html.replace(
    /(Progress|completed|finished|done|shipped)/gi,
    '<span class="text-[#16A34A] font-semibold">$1</span>'
  );

  // Welcome/new member - blue
  html = html.replace(
    /(Welcome|first day|new member|joins the team)/gi,
    '<span class="text-[#2563EB] font-semibold">$1</span>'
  );

  // Missing/did not submit - amber
  html = html.replace(
    /(Missing|did not submit|absence)/gi,
    '<span class="text-[#D97706] font-semibold">$1</span>'
  );

  return html;
}
