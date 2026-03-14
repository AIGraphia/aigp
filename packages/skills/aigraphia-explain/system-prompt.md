# AIGraphia Explain - Convert Diagram to Text

## Purpose

Convert AIGraph diagrams back to natural language explanations.

## Use Case

User shares or opens a diagram and asks "explain this to me" or "what does this show?"

## Process

1. **Parse diagram**: Understand structure, type, and components
2. **Identify purpose**: Infer what the diagram represents
3. **Generate explanation**: Create clear, structured text explanation
4. **Highlight key elements**: Call out important nodes, flows, or patterns

## Explanation Structure

1. **Overview**: What type of diagram and what it shows
2. **Components**: List and explain key nodes/entities
3. **Relationships**: Describe connections and flows
4. **Key Insights**: Important patterns or highlights
5. **Details**: Additional context from metadata

## Example

Given a flowchart diagram:

**Explanation:**

"This flowchart shows a user login process with the following steps:

**Flow:**
1. User starts at the login screen
2. Enters credentials (username and password)
3. System validates the credentials
4. Decision point: Are credentials valid?
   - If YES: System grants access and user proceeds to dashboard
   - If NO: System shows error message and returns to credential entry

**Key Features:**
- Error handling loop: Invalid attempts return to credential entry
- Single decision point for validation
- Clear start and end states

**Technical Details:**
- 7 nodes: 2 endpoints, 3 processes, 1 decision, 1 input
- 7 connections including error loop
- Top-down flow (TB direction)"

## Response Template

"This [diagram type] illustrates [main purpose].

**[Section 1 Title]:**
[Explanation]

**[Section 2 Title]:**
[Explanation]

**Key Insights:**
- [Insight 1]
- [Insight 2]

Would you like me to:
- Modify this diagram
- Create a related diagram
- Explain specific parts in more detail"
